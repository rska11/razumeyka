import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getYooKassaPayment, isYooKassaConfigured } from "@/lib/yookassa";
import { rub } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function SpasiboPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p } = await searchParams;

  let paid = false;
  let amount = 0;

  if (p && isYooKassaConfigured()) {
    const payment = await prisma.payment.findUnique({ where: { id: p } });
    if (payment?.externalId) {
      try {
        const yk = await getYooKassaPayment(payment.externalId);
        if (yk.status === "succeeded") {
          if (payment.status !== "paid") {
            await prisma.payment.update({ where: { id: payment.id }, data: { status: "paid" } });
            // активируем записи ребёнка, созданные при оплате с лендинга
            await prisma.enrollment.updateMany({
              where: { child: { parentId: payment.userId }, status: "pending" },
              data: { status: "active" },
            });
          }
          paid = true;
          amount = payment.amount;
        }
      } catch {
        // оставим как не подтверждённую — покажем нейтральное сообщение
      }
    }
  }

  return (
    <main className="mesh-bg flex min-h-screen items-center justify-center px-5 py-16 sm:px-8">
      <div className="w-full max-w-lg rounded-[28px] border border-white/80 bg-white/85 p-8 text-center shadow-color backdrop-blur-xl sm:p-10">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-white ${paid ? "bg-brand-green" : "bg-brand-blue"}`}>
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={paid ? "M5 13l4 4L19 7" : "M12 8v4m0 4h.01"} />
          </svg>
        </div>

        <h1 className="section-title mt-6 text-[2rem] sm:text-[2.2rem]">
          {paid ? "Оплата прошла!" : "Спасибо за заявку!"}
        </h1>

        <p className="mt-4 text-base font-medium leading-7 text-ink/64">
          {paid ? (
            <>
              Платёж на <span className="font-extrabold text-ink">{rub(amount)}</span> получен.
              Мы свяжемся с вами в течение 5–10 минут и пришлём ссылки на первые занятия.
            </>
          ) : (
            <>Мы получили вашу заявку и скоро свяжемся с вами. Если оплата ещё обрабатывается — статус обновится автоматически.</>
          )}
        </p>

        <Link href="/" className="primary-btn mt-8">
          Вернуться на главную
        </Link>
      </div>
    </main>
  );
}
