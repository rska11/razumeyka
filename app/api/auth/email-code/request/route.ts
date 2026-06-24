import { NextResponse } from "next/server";
import { createAndSaveEmailCode } from "@/lib/email-code";
import { sendLoginCodeEmail } from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let email = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "INVALID_EMAIL" }, { status: 400 });
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
    return NextResponse.json({ error: "MAIL_FAILED" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
