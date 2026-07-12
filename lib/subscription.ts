import { prisma } from "@/lib/prisma";

// Подписка на self-study библиотеку (доступ ко всем урокам-играм).
// Пилот: оплаченный период доступа (без автосписания). Продлевается вручную.
// Автопродление добавим позже через сохранённый способ оплаты (User.paymentMethodId).

export const SUBSCRIPTION_PRICE = 490; // ₽ за период
export const SUBSCRIPTION_MONTHS = 1;

export async function getAccessUntil(userId: string): Promise<Date | null> {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { accessUntil: true },
  });
  return u?.accessUntil ?? null;
}

export async function hasActiveAccess(userId: string): Promise<boolean> {
  const until = await getAccessUntil(userId);
  return Boolean(until && until.getTime() > Date.now());
}

/** Продлить доступ на N месяцев от текущей даты окончания (или от сегодня, если истёк). */
export async function extendAccess(userId: string, months: number): Promise<void> {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { accessUntil: true },
  });
  const now = Date.now();
  const base = u?.accessUntil && u.accessUntil.getTime() > now ? new Date(u.accessUntil) : new Date();
  base.setMonth(base.getMonth() + Math.max(1, months));
  await prisma.user.update({ where: { id: userId }, data: { accessUntil: base } });
}
