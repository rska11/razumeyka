import { prisma } from "@/lib/prisma";
import { getYooKassaPayment, isYooKassaConfigured } from "@/lib/yookassa";
import { extendAccess } from "@/lib/subscription";

/**
 * Сверка незавершённых платежей родителя со статусом в ЮKassa.
 * Вызывается при заходе на страницу оплат (после возврата с ЮKassa) — так
 * оплата подтверждается даже без вебхука (актуально, если магазин общий с genpic).
 */
export async function reconcileUserPayments(userId: string): Promise<void> {
  if (!isYooKassaConfigured()) return;

  const pending = await prisma.payment.findMany({
    where: { userId, status: "pending", provider: "yookassa", externalId: { not: null } },
  });

  for (const p of pending) {
    if (!p.externalId) continue;
    try {
      const yk = await getYooKassaPayment(p.externalId);
      if (yk.status === "succeeded") {
        await prisma.payment.update({ where: { id: p.id }, data: { status: "paid" } });
        if (p.purpose === "subscription") {
          await extendAccess(p.userId, p.periodMonths ?? 1);
        } else if (p.enrollmentId) {
          await prisma.enrollment.updateMany({
            where: { id: p.enrollmentId },
            data: { status: "active" },
          });
        }
      } else if (yk.status === "canceled") {
        await prisma.payment.update({ where: { id: p.id }, data: { status: "failed" } });
      }
    } catch (e) {
      console.error("[reconcile] не удалось проверить платёж", p.id, e);
    }
  }
}
