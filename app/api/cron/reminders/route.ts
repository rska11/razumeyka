import { NextResponse } from "next/server";
import { sendDueReminders } from "@/lib/reminders";

export const dynamic = "force-dynamic";

function authorized(req: Request): boolean {
  const secret = (process.env.CRON_SECRET ?? "").trim();
  if (!secret) return false; // без секрета эндпоинт закрыт
  const auth = req.headers.get("authorization") ?? "";
  const key = new URL(req.url).searchParams.get("key") ?? "";
  return auth === `Bearer ${secret}` || key === secret;
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const res = await sendDueReminders();
  return NextResponse.json({ ok: true, ...res });
}
