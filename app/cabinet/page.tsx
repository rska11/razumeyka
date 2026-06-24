import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { ensureDemoData, getCabinetData } from "@/lib/cabinet";

function rub(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

function fmtDateTime(d: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function CabinetOverview() {
  const session = await getAuthSession();
  if (!session?.user?.id) redirect("/login?callbackUrl=/cabinet");
  const userId = session.user.id;
  await ensureDemoData(userId);
  const { children, payments, upcomingLessons, activeEnrollments, achievementsCount } = await getCabinetData(userId);

  const nextLesson = upcomingLessons[0];
  const paidTotal = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);

  const stats = [
    { label: "Детей", value: String(children.length), accent: "text-brand-blue" },
    { label: "Активных направлений", value: String(activeEnrollments.length), accent: "text-brand-pink" },
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

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Ближайшие занятия */}
        <section className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-extrabold text-ink">Ближайшие занятия</h2>
            <Link href="/cabinet/schedule" className="text-sm font-extrabold text-brand-blue hover:text-brand-blue/70">
              Всё расписание →
            </Link>
          </div>
          <div className="mt-4 grid gap-3">
            {upcomingLessons.length === 0 && (
              <p className="rounded-[16px] bg-ink/[0.02] px-4 py-6 text-center text-sm font-bold text-ink/50">
                Пока нет запланированных занятий.
              </p>
            )}
            {upcomingLessons.slice(0, 4).map(({ lesson, child, enrollment }) => (
              <div key={lesson.id} className="flex items-center gap-3 rounded-[16px] border border-ink/6 bg-white px-4 py-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black text-white ${child.avatarColor ?? "bg-brand-blue"}`}>
                  {child.name.slice(0, 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-ink">{enrollment.directionTitle}</p>
                  <p className="truncate text-xs font-bold text-ink/52">{child.name} · {lesson.topic ?? "Занятие"}</p>
                </div>
                <span className="shrink-0 text-right text-xs font-extrabold text-ink/64">{fmtDateTime(lesson.startsAt)}</span>
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
          <div className="mt-4 grid gap-3">
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
                      {child.enrollments.length} {child.enrollments.length === 1 ? "направление" : "направления"}
                    </p>
                  </div>
                </div>
                {child.enrollments.map((e) => (
                  <div key={e.id} className="mt-3">
                    <div className="flex items-center justify-between text-xs font-extrabold text-ink/64">
                      <span className="truncate">{e.directionTitle}</span>
                      <span>{e.progress}%</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink/8">
                      <div className="h-full rounded-full bg-brand-blue" style={{ width: `${e.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>

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
