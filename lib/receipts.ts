// Выдача чеков самозанятого (НПД) по успешной оплате — через API «Мой налог»
// (lknpd.nalog.ru). Перенесено из genpic (F:\projects\genpic\src\lib\receipts.ts).
//
// Креды в env: NPD_INN + NPD_PASSWORD (копируются с genpic скриптом deploy/copy-npd.sh),
// включение: NPD_RECEIPTS_ENABLED=1. Пока не включено — no-op, оплату не трогает.
// Ссылка на чек сохраняется в Payment.receiptUrl и дублируется письмом на email родителя.

import { prisma } from "@/lib/prisma";
import { sendReceiptEmail } from "@/lib/mailer";

// Наименование услуги в чеке — должно совпадать с формулировкой в оферте.
export const RECEIPT_SERVICE_NAME =
  "Предоставление доступа к обучающим онлайн-материалам сервиса «Разумейка»";

function isReceiptsEnabled(): boolean {
  return String(process.env.NPD_RECEIPTS_ENABLED || "").trim() === "1";
}

const LKNPD_BASE = "https://lknpd.nalog.ru/api/v1";

// Дата-время в формате, который ждёт lknpd: ISO с офсетом МСК (+03:00).
function moscowDateTime(date = new Date()): string {
  const msk = new Date(date.getTime() + 3 * 60 * 60 * 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    `${msk.getUTCFullYear()}-${p(msk.getUTCMonth() + 1)}-${p(msk.getUTCDate())}` +
    `T${p(msk.getUTCHours())}:${p(msk.getUTCMinutes())}:${p(msk.getUTCSeconds())}+03:00`
  );
}

// Авторизация в «Мой налог» по ИНН + паролю (из env). Возвращает токен и ИНН.
async function lknpdAuth(): Promise<{ token: string; inn: string } | null> {
  const inn = String(process.env.NPD_INN || "").trim();
  const password = String(process.env.NPD_PASSWORD || "").trim();
  if (!inn || !password) return null;

  const res = await fetch(`${LKNPD_BASE}/auth/lkfl`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Referer: "https://lknpd.nalog.ru/" },
    body: JSON.stringify({
      username: inn,
      password,
      deviceInfo: {
        sourceDeviceId: String(process.env.NPD_DEVICE_ID || "razumeyka-server-001"),
        sourceType: "WEB",
        appVersion: "1.0.0",
        metaDetails: { userAgent: "Razumeyka/1.0 (+https://razumeyka-school.ru)" },
      },
    }),
  });
  if (!res.ok) {
    console.warn("[receipts] lknpd auth failed", { status: res.status });
    return null;
  }
  const data: { token?: string; profile?: { inn?: string } } | null = await res
    .json()
    .catch(() => null);
  const token = data?.token;
  if (!token) return null;
  return { token, inn: data?.profile?.inn || inn };
}

/** Создаёт чек в «Мой налог» и возвращает ссылку на печатную форму чека. */
async function createNpdReceipt(params: {
  amountRub: number;
  description: string;
}): Promise<string | null> {
  const amount = Math.round(Number(params.amountRub) * 100) / 100;
  if (!Number.isFinite(amount) || amount <= 0) return null;

  const auth = await lknpdAuth();
  if (!auth) return null;

  const dt = moscowDateTime();
  const res = await fetch(`${LKNPD_BASE}/income`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.token}`,
      Referer: "https://lknpd.nalog.ru/",
    },
    body: JSON.stringify({
      paymentType: "CASH",
      ignoreMaxTotalIncomeRestriction: false,
      client: { contactPhone: null, displayName: null, incomeType: "FROM_INDIVIDUAL", inn: null },
      requestTime: dt,
      operationTime: dt,
      services: [{ name: params.description, amount, quantity: 1 }],
      totalAmount: String(amount),
    }),
  });
  if (!res.ok) {
    console.warn("[receipts] lknpd income failed", { status: res.status });
    return null;
  }
  const data: { approvedReceiptUuid?: string } | null = await res.json().catch(() => null);
  const uuid = data?.approvedReceiptUuid;
  if (!uuid) return null;

  // Печатная форма чека (публичная ссылка по ИНН + UUID).
  return `${LKNPD_BASE}/receipt/${auth.inn}/${uuid}/print`;
}

/** Проверка авторизации в «Мой налог» (для админ-теста). Токен не раскрываем. */
export async function testNpdAuth(): Promise<{ ok: boolean; inn?: string; error?: string }> {
  try {
    const auth = await lknpdAuth();
    if (!auth) return { ok: false, error: "no creds or auth failed" };
    return { ok: true, inn: auth.inn };
  } catch (e) {
    return { ok: false, error: String((e as Error)?.message || e) };
  }
}

/**
 * Выдаёт чек по оплаченному платежу (идемпотентно) и шлёт ссылку письмом.
 * Никогда не бросает ошибку наружу — выдача чека не должна ломать открытие доступа.
 */
export async function issueReceiptForPayment(paymentId: string, amountRub: number): Promise<void> {
  try {
    if (!isReceiptsEnabled()) return;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      select: { id: true, receiptUrl: true, user: { select: { email: true } } },
    });
    if (!payment || payment.receiptUrl) return; // нет платежа или чек уже выдан

    const url = await createNpdReceipt({ amountRub, description: RECEIPT_SERVICE_NAME });
    if (!url) return;

    await prisma.payment.update({ where: { id: paymentId }, data: { receiptUrl: url } });
    console.info("[receipts] чек выдан", { paymentId, url });

    // Дублируем ссылку на чек письмом (кабинет — основной канал)
    try {
      if (payment.user?.email) await sendReceiptEmail(payment.user.email, url);
    } catch (mailErr) {
      console.warn("[receipts] письмо с чеком не ушло", { paymentId, mailErr });
    }
  } catch (error) {
    console.warn("[receipts] issueReceiptForPayment failed", { paymentId, error });
  }
}
