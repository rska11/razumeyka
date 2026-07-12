import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createYooKassaPayment, isYooKassaConfigured } from "@/lib/yookassa";
import { SUBSCRIPTION_MONTHS, SUBSCRIPTION_PRICE } from "@/lib/subscription";

// Оформление подписки на self-study библиотеку. Создаёт платёж purpose="subscription";
// доступ (User.accessUntil) продлевается в вебхуке/reconcile после успешной оплаты.
export async function POST() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  if (!isYooKassaConfigured()) {
    return NextResponse.json({ error: "PAYMENTS_DISABLED" }, { status: 503 });
  }

  const amount = SUBSCRIPTION_PRICE;
  const description = `Подписка «Разумейка» · доступ к урокам рисования · ${SUBSCRIPTION_MONTHS} мес`;

  const payment = await prisma.payment.create({
    data: {
      userId: session.user.id,
      amount,
      status: "pending",
      provider: "yookassa",
      purpose: "subscription",
      periodMonths: SUBSCRIPTION_MONTHS,
      description,
    },
  });

  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://razumeyka-school.ru").replace(/\/+$/, "");

  try {
    const yk = await createYooKassaPayment({
      amountRub: amount,
      description,
      returnUrl: `${site}/risovanie`,
      metadata: { paymentId: payment.id },
      customerEmail: session.user.email || undefined,
    });
    await prisma.payment.update({ where: { id: payment.id }, data: { externalId: yk.id } });

    const url = yk.confirmation?.confirmation_url;
    if (!url) throw new Error("no confirmation_url");
    return NextResponse.json({ url });
  } catch (e) {
    console.error("[subscription/create] YooKassa error:", e);
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "failed" } });
    return NextResponse.json({ error: "YK_FAILED" }, { status: 502 });
  }
}
