import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { landingTotal, TARIFF_LABELS } from "@/lib/pricing";
import { createYooKassaPayment, isYooKassaConfigured } from "@/lib/yookassa";
import { isAuthDisabled } from "@/lib/settings";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Гостевой чекаут с лендинга: создаёт родителя по email + платёж → ЮKassa.
export async function POST(req: Request) {
  // Режим доработки (рубильник): не собираем ПД и не принимаем оплату
  if (await isAuthDisabled()) {
    return NextResponse.json({ error: "MAINTENANCE" }, { status: 503 });
  }
  if (!isYooKassaConfigured()) {
    return NextResponse.json({ error: "PAYMENTS_DISABLED" }, { status: 503 });
  }

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
  }

  const email = String(b.email ?? "").trim().toLowerCase();
  const name = String(b.name ?? "").trim().slice(0, 80);
  const phone = String(b.phone ?? "").trim().slice(0, 40);
  const isTrial = Boolean(b.isTrial);
  const format = b.format === "individual" ? "individual" : "collective";
  const tariff = typeof b.tariff === "string" ? b.tariff : null;
  const directions = Array.isArray(b.directions) ? b.directions.map((x) => String(x)).slice(0, 5) : [];
  const schedule = String(b.schedule ?? "").slice(0, 200);

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "INVALID_EMAIL" }, { status: 400 });
  }

  // Сумму считаем на сервере — клиенту не доверяем
  const amount = landingTotal(isTrial, format, tariff, directions.length);
  if (amount <= 0) {
    return NextResponse.json({ error: "NO_PRICE" }, { status: 400 });
  }

  const description = [
    isTrial ? "Пробный урок" : (TARIFF_LABELS[tariff ?? ""] ?? "Пакет"),
    format === "individual" ? "индивидуально" : "группа",
    directions.join(", "),
  ]
    .filter(Boolean)
    .join(" · ")
    .slice(0, 128);

  const user = await prisma.user.upsert({
    where: { email },
    update: { name: name || undefined, phone: phone || undefined },
    create: { email, name: name || null, phone: phone || null, provider: "landing" },
  });

  const payment = await prisma.payment.create({
    data: {
      userId: user.id,
      amount,
      status: "pending",
      provider: "yookassa",
      description: schedule ? `${description} · ${schedule}` : description,
    },
  });

  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://razumeyka-school.ru").replace(/\/+$/, "");

  try {
    const yk = await createYooKassaPayment({
      amountRub: amount,
      description,
      returnUrl: `${site}/spasibo?p=${payment.id}`,
      metadata: { paymentId: payment.id },
      customerEmail: email,
    });
    await prisma.payment.update({ where: { id: payment.id }, data: { externalId: yk.id } });
    const url = yk.confirmation?.confirmation_url;
    if (!url) throw new Error("no confirmation_url");
    return NextResponse.json({ url });
  } catch (e) {
    console.error("[checkout] YooKassa error:", e);
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "failed" } });
    return NextResponse.json({ error: "YK_FAILED" }, { status: 502 });
  }
}
