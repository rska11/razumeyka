import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Простая проверка email — не пускаем явный мусор, без жёсткого RFC.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос." }, { status: 400 });
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const email = String(data.email ?? "").trim().toLowerCase().slice(0, 160);
  const direction = String(data.direction ?? "").trim().slice(0, 60);
  const source = data.source ? String(data.source).trim().slice(0, 24) : null;

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Введите корректный email." }, { status: 400 });
  }
  if (!direction) {
    return NextResponse.json({ error: "Не указано направление." }, { status: 400 });
  }

  // Один email на направление — повторная отправка не создаёт дублей и не ошибается.
  await prisma.waitlist.upsert({
    where: { email_direction: { email, direction } },
    create: { email, direction, source },
    update: {},
  });

  return NextResponse.json({ ok: true });
}
