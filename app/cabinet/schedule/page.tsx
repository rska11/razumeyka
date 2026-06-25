import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { getCabinetData } from "@/lib/cabinet";

function fmt(d: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function SchedulePage() {
  const session = await getAuthSession();
  if (!session?.user?.id) redirect("/login?callbackUrl=/cabinet");
  const { children } = await getCabinetData(session.user.id);

  const now = new Date();
  const all = children.flatMap((c) =>
    c.enrollments.flatMap((e) => e.lessons.map((l) => ({ l, c, e }))),
  );
  const upcoming = all.filter((x) => x.l.startsAt >= now).sort((a, b) => a.l.startsAt.getTime() - b.l.startsAt.getTime());
  const past = all.filter((x) => x.l.startsAt < now).sort((a, b) => b.l.startsAt.getTime() - a.l.startsAt.getTime());

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="section-title text-[2rem] sm:text-[2.4rem]">Расписание</h1>
        <p className="mt-2 text-base font-medium text-ink/60">Ближайшие и прошедшие занятия ваших детей.</p>
      </header>

      <section className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl sm:p-6">
        <h2 className="font-display text-xl font-extrabold text-ink">Ближайшие</h2>
        <div className="mt-4 grid gap-3">
          {upcoming.length === 0 && (
            <p className="rounded-[16px] bg-ink/[0.02] px-4 py-6 text-center text-sm font-bold text-ink/50">Запланированных занятий нет.</p>
          )}
          {upcoming.map(({ l, c, e }) => {
            const join = l.joinUrl || e.zoomUrl;
            return (
              <div key={l.id} className="flex items-center gap-3 rounded-[16px] border border-ink/6 bg-white px-4 py-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black text-white ${c.avatarColor ?? "bg-brand-blue"}`}>
                  {c.name.slice(0, 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-ink">{e.directionTitle}</p>
                  <p className="truncate text-xs font-bold text-ink/52">{c.name} · {l.topic ?? "Занятие"}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className="text-right text-xs font-extrabold text-ink/64">{fmt(l.startsAt)}</span>
                  {join && (
                    <a href={join} target="_blank" rel="noopener" className="inline-flex items-center gap-1 rounded-full bg-brand-blue px-3 py-1.5 text-xs font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-brand-blue/90">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 10l4.5-2.5v9L15 14M3 7h12v10H3z" /></svg>
                      Подключиться
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {past.length > 0 && (
        <section className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl sm:p-6">
          <h2 className="font-display text-xl font-extrabold text-ink">Прошедшие</h2>
          <div className="mt-4 grid gap-3">
            {past.map(({ l, c, e }) => (
              <div key={l.id} className="flex items-center gap-3 rounded-[16px] border border-ink/6 bg-white px-4 py-3 opacity-72">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/10 text-sm font-black text-ink/50">
                  {c.name.slice(0, 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-ink">{e.directionTitle}</p>
                  <p className="truncate text-xs font-bold text-ink/52">{c.name} · {l.topic ?? "Занятие"}</p>
                </div>
                <span className="shrink-0 rounded-full bg-brand-green/12 px-2.5 py-1 text-[11px] font-extrabold text-brand-green">Проведено</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
