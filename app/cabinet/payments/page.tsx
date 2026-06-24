import { getAuthSession } from "@/lib/auth";
import { getCabinetData } from "@/lib/cabinet";

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
  const { payments } = await getCabinetData(session!.user.id);

  const paidTotal = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="section-title text-[2rem] sm:text-[2.4rem]">Оплаты</h1>
        <p className="mt-2 text-base font-medium text-ink/60">История платежей и статусы.</p>
      </header>

      <div className="rounded-[20px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl">
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
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-[16px] border border-ink/6 bg-white px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-ink">{p.description ?? "Оплата"}</p>
                  <p className="text-xs font-bold text-ink/52">
                    {new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(p.createdAt)}
                    {p.provider ? ` · ${p.provider}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold text-ink">{rub(p.amount)}</span>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${st.cls}`}>{st.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
