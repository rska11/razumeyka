import { NextResponse } from "next/server";
import { createAndSaveEmailCode, discardEmailCodes } from "@/lib/email-code";
import { sendLoginCodeEmail } from "@/lib/mailer";
import { isAuthDisabled } from "@/lib/settings";
import { isAdminEmail } from "@/lib/admin";
import { isTeacherEmail } from "@/lib/staff";
import { isRussianEmail } from "@/lib/ru-email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let email = "";
  let consent = false;
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim().toLowerCase();
    consent = body?.consent === true;
  } catch {
    return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "INVALID_EMAIL" }, { status: 400 });
  }

  // Согласие на обработку ПД обязательно (152-ФЗ) — без него код не выдаём
  if (!consent) {
    return NextResponse.json({ error: "CONSENT_REQUIRED" }, { status: 400 });
  }

  // Закон РФ (с 26.06.2026): авторизация только через российскую почту.
  // Исключение — администратор (ADMIN_EMAILS), чтобы не терять доступ к управлению.
  if (!isRussianEmail(email) && !isAdminEmail(email)) {
    return NextResponse.json({ error: "FOREIGN_EMAIL" }, { status: 400 });
  }

  // Рубильник: при выключенной авторизации код выдаём только персоналу (админ/препод)
  if (await isAuthDisabled()) {
    const staff = isAdminEmail(email) || (await isTeacherEmail(email));
    if (!staff) {
      return NextResponse.json({ error: "AUTH_DISABLED" }, { status: 403 });
    }
  }

  const result = await createAndSaveEmailCode(email);

  if (!result.ok) {
    // RATE_LIMITED — недавно уже отправляли код
    return NextResponse.json({ error: result.error }, { status: 429 });
  }

  try {
    await sendLoginCodeEmail(email, result.code);
  } catch (e) {
    console.error("[email-code/request] не удалось отправить письмо:", e);
    // Сбрасываем код, чтобы пользователь мог повторить сразу (без минутной паузы)
    await discardEmailCodes(email);
    return NextResponse.json({ error: "MAIL_FAILED" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
