import Link from "next/link";
import { redirect } from "next/navigation";
import { PaymentStatusRefresh } from "@/components/payments/PaymentStatusRefresh.jsx";
import { getAuthSession } from "@/lib/auth";
import { reconcileUserPayments } from "@/lib/payments";
import { prisma } from "@/lib/prisma";
import { DIRECTIONS, getAccessUntil, isDirectionSlug } from "@/lib/subscription";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const session = await getAuthSession();
  if (!session?.user?.id) redirect("/login?callbackUrl=/cabinet");

  const { p } = await searchParams;
  await reconcileUserPayments(session.user.id);

  const payment = p
    ? await prisma.payment.findFirst({ where: { id: p, userId: session.user.id } })
    : null;
  const direction = isDirectionSlug(payment?.directionSlug) ? payment.directionSlug : null;
  const course = direction ? DIRECTIONS[direction] : null;
  const accessUntil = direction ? await getAccessUntil(session.user.id, direction) : null;
  const paid = payment?.status === "paid";
  const pending = payment?.status === "pending";
  const failed = payment?.status === "failed";
  const courseHref = course ? `${course.path}#uroki` : "/cabinet";

  return (
    <main className="mesh-bg relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12 sm:px-8">
      <PaymentStatusRefresh active={pending} />
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-brand-blue/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-brand-pink/18 blur-3xl" />

      <section className="relative w-full max-w-2xl overflow-hidden rounded-[36px] border border-white/80 bg-white/88 p-6 shadow-luxe backdrop-blur-2xl sm:p-10">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink" />
        <Link href="/" className="font-display text-lg font-extrabold text-ink">
          Разумейка
        </Link>

        <div className="mt-8 text-center">
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] text-white shadow-color ${
              paid
                ? "bg-gradient-to-br from-brand-green to-forest-500"
                : failed
                  ? "bg-gradient-to-br from-brand-red to-brand-orange"
                  : "bg-gradient-to-br from-brand-blue to-brand-purple"
            }`}
          >
            {paid ? (
              <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            ) : pending ? (
              <svg className="h-10 w-10 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M21 12a9 9 0 10-3 6.7" />
              </svg>
            ) : (
              <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M12 8v5m0 3h.01" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            )}
          </div>

          <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-blue">
            {paid ? "Доступ активирован" : pending ? "Проверяем платёж" : "Статус оплаты"}
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.03em] text-[#0b1f3a] sm:text-5xl">
            {paid
              ? "Всё готово — можно заниматься!"
              : pending
                ? "Оплата подтверждается"
                : failed
                  ? "Оплата не завершена"
                  : "Платёж не найден"}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base font-medium leading-7 text-ink/62 sm:text-lg">
            {paid
              ? `${course?.title ?? "Выбранное направление"} уже открыто. Переходите к урокам — ничего дополнительно настраивать не нужно.`
              : pending
                ? "Обычно это занимает несколько секунд. Страница обновится автоматически, как только ЮKassa подтвердит платёж."
                : failed
                  ? "Деньги не списаны. Можно вернуться к программе и попробовать ещё раз."
                  : "Мы не смогли найти этот платёж в вашем аккаунте. Проверьте историю оплат в кабинете."}
          </p>
        </div>

        {paid && (
          <div className="mt-8 rounded-[24px] border border-brand-green/18 bg-brand-green/[0.06] p-5 text-left sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-ink/44">Ваш курс</p>
                <p className="mt-1 font-display text-xl font-extrabold text-ink sm:text-2xl">{course?.title ?? "Разумейка"}</p>
              </div>
              <span className="rounded-full bg-brand-green/14 px-3 py-1.5 text-xs font-extrabold text-brand-green">Оплачено</span>
            </div>
            {accessUntil && (
              <p className="mt-4 text-sm font-bold text-ink/58">Полный доступ открыт до {formatDate(accessUntil)}</p>
            )}
          </div>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {paid ? (
            <>
              <Link href={courseHref} className="primary-btn w-full">
                Перейти к урокам
                <span aria-hidden="true" className="ml-2">→</span>
              </Link>
              <Link href="/cabinet" className="secondary-btn w-full">В личный кабинет</Link>
            </>
          ) : (
            <>
              <Link href={course ? `${course.path}#podpiska` : "/cabinet/payments"} className="primary-btn w-full">
                {failed ? "Попробовать снова" : "Проверить в кабинете"}
              </Link>
              <Link href="/cabinet" className="secondary-btn w-full">Вернуться в кабинет</Link>
            </>
          )}
        </div>

        {pending && (
          <p className="mt-5 text-center text-xs font-bold text-ink/42">
            Не закрывайте страницу — мы обновляем статус автоматически
          </p>
        )}
      </section>
    </main>
  );
}
