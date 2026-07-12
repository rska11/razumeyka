import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createYooKassaPayment, isYooKassaConfigured } from "@/lib/yookassa";
import {
  DIRECTIONS,
  SUBSCRIPTION_MONTHS,
  SUBSCRIPTION_PRICE,
  directionFromReturnTo,
} from "@/lib/subscription";

// Оформление доступа к направлению self-study. Создаёт платёж purpose="subscription"
// с directionSlug; доступ (Access.until) продлевается по направлению в вебхуке/reconcile.
// Доступ раздельный: returnTo определяет направление (по allow-списку, без open redirect).
// Требуется акцепт оферты (acceptedOffer=true) — фиксируем offerAcceptedAt.

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  if (!isYooKassaConfigured()) {
    return NextResponse.json({ error: "PAYMENTS_DISABLED" }, { status: 503 });
  }

  let returnTo = "/risovanie";
  let acceptedOffer = false;
  try {
    const body = await req.json();
    const direction = typeof body?.returnTo === "string" ? directionFromReturnTo(body.returnTo) : null;
    if (direction) returnTo = DIRECTIONS[direction].path;
    acceptedOffer = body?.acceptedOffer === true;
  } catch {}

  const direction = directionFromReturnTo(returnTo)!; // returnTo всегда валиден выше
  if (!acceptedOffer) {
    return NextResponse.json({ error: "OFFER_NOT_ACCEPTED" }, { status: 400 });
  }

  const amount = SUBSCRIPTION_PRICE;
  const description = `«Разумейка» · доступ · ${DIRECTIONS[direction].title} · ${SUBSCRIPTION_MONTHS} мес`;

  const payment = await prisma.payment.create({
    data: {
      userId: session.user.id,
      amount,
      status: "pending",
      provider: "yookassa",
      purpose: "subscription",
      periodMonths: SUBSCRIPTION_MONTHS,
      directionSlug: direction,
      offerAcceptedAt: new Date(),
      description,
    },
  });

  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://razumeyka-school.ru").replace(/\/+$/, "");

  try {
    const yk = await createYooKassaPayment({
      amountRub: amount,
      description,
      returnUrl: `${site}${returnTo}`,
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
