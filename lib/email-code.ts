import { createHash, randomInt } from "crypto";
import { prisma } from "@/lib/prisma";

const MAX_ATTEMPTS = 5;
const CODE_TTL_MS = 10 * 60 * 1000; // 10 минут
const RESEND_COOLDOWN_MS = 60 * 1000; // 1 минута между повторными отправками

export function generateCode(): string {
  return String(randomInt(100000, 1000000));
}

export function hashEmailCode(code: string): string {
  return createHash("sha256").update(code.trim()).digest("hex");
}

export type CreateCodeResult =
  | { ok: true; code: string }
  | { ok: false; error: "RATE_LIMITED" };

export async function createAndSaveEmailCode(email: string): Promise<CreateCodeResult> {
  const normalized = email.trim().toLowerCase();

  // Анти-спам: не выдаём новый код, если недавно уже отправляли
  const recent = await prisma.emailLoginCode.findFirst({
    where: {
      email: normalized,
      usedAt: null,
      createdAt: { gt: new Date(Date.now() - RESEND_COOLDOWN_MS) },
    },
  });

  if (recent) {
    return { ok: false, error: "RATE_LIMITED" };
  }

  const code = generateCode();

  await prisma.emailLoginCode.create({
    data: {
      email: normalized,
      codeHash: hashEmailCode(code),
      expiresAt: new Date(Date.now() + CODE_TTL_MS),
      attempts: 0,
    },
  });

  return { ok: true, code };
}

export type VerifyCodeResult =
  | { ok: true; userId: string; email: string }
  | { ok: false; error: "INVALID_CODE" | "EXPIRED" | "TOO_MANY_ATTEMPTS" | "NOT_FOUND" };

export async function verifyEmailLoginCode(email: string, code: string): Promise<VerifyCodeResult> {
  const normalized = email.trim().toLowerCase();

  const record = await prisma.emailLoginCode.findFirst({
    where: { email: normalized, usedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!record) return { ok: false, error: "NOT_FOUND" };
  if (record.expiresAt < new Date()) return { ok: false, error: "EXPIRED" };
  if (record.attempts >= MAX_ATTEMPTS) return { ok: false, error: "TOO_MANY_ATTEMPTS" };

  if (record.codeHash !== hashEmailCode(code)) {
    await prisma.emailLoginCode.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    return { ok: false, error: "INVALID_CODE" };
  }

  // Код верный — помечаем использованным
  await prisma.emailLoginCode.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  // Находим или создаём родителя
  const user = await prisma.user.upsert({
    where: { email: normalized },
    update: {},
    create: { email: normalized, provider: "email-code" },
    select: { id: true, email: true },
  });

  return { ok: true, userId: user.id, email: normalized };
}
