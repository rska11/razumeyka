import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enrollmentPrice, TARIFF_LABELS } from "@/lib/pricing";
import { createYooKassaPayment, isYooKassaConfigured } from "@/lib/yookassa";

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  if (!isYooKassaConfigured()) {
    return NextResponse.json({ error: "PAYMENTS_DISABLED" }, { status: 503 });
  }

  let enrollmentId = "";
  try {
    const body = await req.json();
    enrollmentId = String(body?.enrollmentId ?? "");
  } catch {
    return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
  }

  // Запись должна принадлежать ребёнку этого родителя
  const enrollment = await prisma.enrollment.findFirst({
    where: { id: enrollmentId, child: { parentId: session.user.id } },
    include: { child: true },
  });
  if (!enrollment) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const amount = enrollmentPrice(enrollment.format, enrollment.tariff);
  if (amount <= 0) {
    return NextResponse.json({ error: "NO_PRICE" }, { status: 400 });
  }

  const description = `${enrollment.directionTitle} · ${enrollment.format === "individual" ? "индивидуально" : "группа"} · ${TARIFF_LABELS[enrollment.tariff ?? ""] ?? ""} · ${enrollment.child.name}`;

  // Наш платёж (pending) — на него сошлётся вебхук по metadata.paymentId
  const payment = await prisma.payment.create({
    data: {
      userId: session.user.id,
      enrollmentId: enrollment.id,
      amount,
      status: "pending",
      provider: "yookassa",
      description,
    },
  });

  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://razumeyka-school.ru").replace(/\/+$/, "");

  try {
    const yk = await createYooKassaPayment({
      amountRub: amount,
      description,
      returnUrl: `${site}/cabinet/payments`,
      metadata: { paymentId: payment.id },
      customerEmail: session.user.email || undefined,
    });
    await prisma.payment.update({ where: { id: payment.id }, data: { externalId: yk.id } });

    const url = yk.confirmation?.confirmation_url;
    if (!url) throw new Error("no confirmation_url");
    return NextResponse.json({ url });
  } catch (e) {
    console.error("[payments/create] YooKassa error:", e);
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "failed" } });
    return NextResponse.json({ error: "YK_FAILED" }, { status: 502 });
  }
}
