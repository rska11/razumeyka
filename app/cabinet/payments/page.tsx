import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { getCabinetData } from "@/lib/cabinet";
import { reconcileUserPayments } from "@/lib/payments";
import { DIRECTIONS, isDirectionSlug } from "@/lib/subscription";

function rub(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

const STATUS: Record<string, { label: string; cls: string }> = {
  paid: { label: "Оплачено", cls: "bg-brand-green/12 text-brand-green" },
  pending: { label: "Ожидает", cls: "bg-brand-orange/12 text-brand-orange" },
  failed: { label: "Ошибка", cls: "bg-brand-red/12 text-brand-red" },
  refunded: { label: "Возврат", cls: "bg-ink/8 text-ink/60" },
};

export default async function PaymentsPage() {
  const session = await getAuthSession();
  if (!session?.user?.id) redirect("/login?callbackUrl=/cabinet");
  // Подтверждаем оплаты по возвращении с ЮKassa (без зависимости от вебхука)
  await reconcileUserPayments(session.user.id);
  const { payments } = await getCabinetData(session.user.id);

  const paidTotal = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="grid gap-6">
      <header>
        <span className="inline-flex rounded-full border border-brand-blue/14 bg-white/70 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-blue shadow-sm">
          Личный кабинет
        </span>
        <h1 className="mt-4 font-display text-[2.25rem] font-extrabold tracking-[-0.04em] text-[#0b1f3a] sm:text-[3rem]">Оплаты и чеки</h1>
        <p className="mt-2 text-base font-medium text-ink/60">Все операции, статусы и быстрый переход к оплаченным занятиям.</p>
      </header>

      <div className="rounded-[24px] border border-white/80 bg-gradient-to-br from-white/92 to-brand-green/[0.06] p-5 shadow-card backdrop-blur-xl sm:p-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/46">Всего оплачено</p>
        <p className="mt-1 font-display text-3xl font-extrabold text-brand-green">{rub(paidTotal)}</p>
      </div>

      <section className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl sm:p-6">
        <div className="grid gap-2">
          {payments.length === 0 && (
            <p className="rounded-[16px] bg-ink/[0.02] px-4 py-6 text-center text-sm font-bold text-ink/50">Оплат пока нет.</p>
          )}
          {payments.map((p) => {
            const st = STATUS[p.status] ?? STATUS.pending;
            return (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-ink/6 bg-white px-4 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-ink">{p.description ?? "Оплата"}</p>
                  <p className="text-xs font-bold text-ink/52">
                    {new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(p.createdAt)}
                    {p.provider ? ` · ${p.provider}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-extrabold text-ink">{rub(p.amount)}</span>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${st.cls}`}>{st.label}</span>
                  {p.status === "paid" && isDirectionSlug(p.directionSlug) && (
                    <Link
                      href={`${DIRECTIONS[p.directionSlug].path}#uroki`}
                      className="rounded-full bg-brand-green px-4 py-2 text-xs font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-green/90"
                    >
                      Перейти к урокам →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
