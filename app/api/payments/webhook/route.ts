import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getYooKassaPayment } from "@/lib/yookassa";
import { extendAccess, isDirectionSlug } from "@/lib/subscription";

export const dynamic = "force-dynamic";

// Вебхук ЮKassa. Всегда отвечаем 200, чтобы ЮKassa не повторяла бесконечно.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const ykId = body?.object?.id;
    if (!ykId) return NextResponse.json({ ok: true });

    // Не доверяем телу вебхука — перепроверяем статус через API ЮKassa
    const yk = await getYooKassaPayment(String(ykId));
    const paymentId = yk?.metadata?.paymentId;
    if (!paymentId) return NextResponse.json({ ok: true });

    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) return NextResponse.json({ ok: true });

    if (yk.status === "succeeded") {
      // идемпотентно: применяем только один раз
      if (payment.status !== "paid") {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "paid", externalId: yk.id },
        });
        if (payment.purpose === "subscription" && isDirectionSlug(payment.directionSlug)) {
          await extendAccess(payment.userId, payment.directionSlug, payment.periodMonths ?? 1);
        } else if (payment.enrollmentId) {
          await prisma.enrollment.updateMany({
            where: { id: payment.enrollmentId },
            data: { status: "active" },
          });
        }
        console.info("[payments/webhook] оплачено", { paymentId: payment.id, ykId: yk.id });
      }
    } else if (yk.status === "canceled") {
      if (payment.status === "pending") {
        await prisma.payment.update({ where: { id: payment.id }, data: { status: "failed" } });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[payments/webhook] error:", e);
    return NextResponse.json({ ok: true });
  }
}
