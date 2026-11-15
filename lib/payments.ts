import { prisma } from "@/lib/prisma";
import { getYooKassaPayment, isYooKassaConfigured } from "@/lib/yookassa";
import { applyPaidSubscription } from "@/lib/subscription";
import { issueReceiptForPayment } from "@/lib/receipts";

/**
 * Отметить платёж оплаченным и выдать то, за что заплатили. Строго один раз:
 * статус меняется атомарно (updateMany с условием status != "paid"), поэтому
 * параллельные вебхук и сверка не продлят доступ дважды.
 * Возвращает true, если именно этот вызов провёл платёж.
 */
export async function markPaymentPaid(paymentId: string, externalId?: string): Promise<boolean> {
  const res = await prisma.payment.updateMany({
    where: { id: paymentId, status: { not: "paid" } },
    data: externalId ? { status: "paid", externalId } : { status: "paid" },
  });
  if (res.count !== 1) return false;

  const p = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!p) return false;

  if (p.purpose === "subscription") {
    await applyPaidSubscription(p);
  } else if (p.enrollmentId) {
    await prisma.enrollment.updateMany({ where: { id: p.enrollmentId }, data: { status: "active" } });
  }
  // Чек НПД («Мой налог») + письмо клиенту. Идемпотентно, не блокирует ответ.
  void issueReceiptForPayment(p.id, p.amount);
  return true;
}

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
        await markPaymentPaid(p.id);
      } else if (yk.status === "canceled") {
        await prisma.payment.updateMany({ where: { id: p.id, status: "pending" }, data: { status: "failed" } });
      }
    } catch (e) {
      console.error("[reconcile] не удалось проверить платёж", p.id, e);
    }
  }
}
