import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { getCabinetData } from "@/lib/cabinet";
import { DIRECTIONS, directionPrice, type DirectionSlug } from "@/lib/subscription";

function rub(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

export default async function CabinetOverview() {
  const session = await getAuthSession();
  if (!session?.user?.id) redirect("/login?callbackUrl=/cabinet");
  const userId = session.user.id;
  const { children, payments, achievementsCount, accessMap } = await getCabinetData(userId);
  const now = new Date();
  const directionAccess = (Object.keys(DIRECTIONS) as DirectionSlug[]).map((slug) => {
    const until = accessMap[slug];
    return { slug, meta: DIRECTIONS[slug], until, active: Boolean(until && until.getTime() > now.getTime()) };
  });

  const openDirections = directionAccess.filter((d) => d.active).length;
  const paidTotal = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);

  const stats = [
    { label: "Детей", value: String(children.length), accent: "text-brand-blue" },
    { label: "Открытых направлений", value: String(openDirections), accent: "text-brand-pink" },
    { label: "Достижений", value: String(achievementsCount), accent: "text-brand-orange" },
    { label: "Оплачено", value: rub(paidTotal), accent: "text-brand-green" },
  ];

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="section-title text-[2rem] sm:text-[2.4rem]">Обзор</h1>
        <p className="mt-2 text-base font-medium text-ink/60">Всё про занятия ваших детей в одном месте.</p>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[20px] border border-white/80 bg-white/85 p-4 shadow-card backdrop-blur-xl">
            <p className={`font-display text-2xl font-extrabold sm:text-3xl ${s.accent}`}>{s.value}</p>
            <p className="mt-1 text-xs font-extrabold leading-5 text-ink/56 sm:text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Доступ к урокам-играм (self-study, раздельно по направлениям) */}
      <section className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl sm:p-6">
        <h2 className="font-display text-xl font-extrabold text-ink">Доступ к урокам-играм</h2>
        <p className="mt-1 text-xs font-bold text-ink/52">Доступ открывается по каждому направлению отдельно.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {directionAccess.map(({ slug, meta, until, active }) => (
            <div key={slug} className="flex flex-col gap-3 rounded-[16px] border border-ink/6 bg-white px-4 py-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-extrabold text-ink">{meta.title}</p>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${active ? "bg-brand-green/12 text-brand-green" : "bg-ink/8 text-ink/55"}`}>
                  {active ? "Оплачен" : "Не открыт"}
                </span>
              </div>
              {active ? (
                <p className="text-xs font-bold text-ink/56">
                  Открыт до {until ? new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(until) : "—"}
                </p>
              ) : (
                <Link href={`${meta.path}#podpiska`} className="inline-flex w-fit items-center gap-1 rounded-full bg-brand-blue px-3 py-1.5 text-xs font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-brand-blue/90">
                  Открыть за {directionPrice(slug)} ₽ →
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Дети */}
      <section className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold text-ink">Дети</h2>
          <Link href="/cabinet/children" className="text-sm font-extrabold text-brand-blue hover:text-brand-blue/70">
            Управлять →
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {children.length === 0 && (
            <p className="rounded-[16px] bg-ink/[0.02] px-4 py-6 text-center text-sm font-bold text-ink/50">
              Добавьте профиль ребёнка в разделе «Дети».
            </p>
          )}
          {children.map((child) => (
            <div key={child.id} className="rounded-[16px] border border-ink/6 bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black text-white ${child.avatarColor ?? "bg-brand-blue"}`}>
                  {child.name.slice(0, 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-ink">{child.name}</p>
                  <p className="text-xs font-bold text-ink/52">
                    {child.achievements.length} {child.achievements.length === 1 ? "достижение" : "достижений"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Оплаты */}
      <section className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold text-ink">Последние оплаты</h2>
          <Link href="/cabinet/payments" className="text-sm font-extrabold text-brand-blue hover:text-brand-blue/70">
            Все оплаты →
          </Link>
        </div>
        <div className="mt-4 grid gap-2">
          {payments.length === 0 && (
            <p className="rounded-[16px] bg-ink/[0.02] px-4 py-6 text-center text-sm font-bold text-ink/50">Оплат пока нет.</p>
          )}
          {payments.slice(0, 4).map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-[16px] border border-ink/6 bg-white px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-ink">{p.description ?? "Оплата"}</p>
                <p className="text-xs font-bold text-ink/52">{new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(p.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-extrabold text-ink">{rub(p.amount)}</span>
                <PaymentBadge status={p.status} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    paid: { label: "Оплачено", cls: "bg-brand-green/12 text-brand-green" },
    pending: { label: "Ожидает", cls: "bg-brand-orange/12 text-brand-orange" },
    failed: { label: "Ошибка", cls: "bg-brand-red/12 text-brand-red" },
    refunded: { label: "Возврат", cls: "bg-ink/8 text-ink/60" },
  };
  const m = map[status] ?? map.pending;
  return <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${m.cls}`}>{m.label}</span>;
}
