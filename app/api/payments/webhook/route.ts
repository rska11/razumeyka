import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getYooKassaPayment } from "@/lib/yookassa";
import { markPaymentPaid } from "@/lib/payments";

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

    const payment = await prisma.payment.findUnique({ where: { id: paymentId }, select: { id: true } });
    if (!payment) return NextResponse.json({ ok: true });

    if (yk.status === "succeeded") {
      // идемпотентно: markPaymentPaid применяет оплату строго один раз
      const applied = await markPaymentPaid(payment.id, yk.id);
      if (applied) console.info("[payments/webhook] оплачено", { paymentId: payment.id, ykId: yk.id });
    } else if (yk.status === "canceled") {
      await prisma.payment.updateMany({ where: { id: payment.id, status: "pending" }, data: { status: "failed" } });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[payments/webhook] error:", e);
    return NextResponse.json({ ok: true });
  }
}
