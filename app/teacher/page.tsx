import { getTeacherSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  teacherSetZoom,
  teacherAddLesson,
  teacherDeleteLesson,
  teacherSetProgress,
  teacherAddAchievement,
  teacherDeleteAchievement,
} from "./actions";

const DAY_LABELS: Record<string, string> = {
  mon: "Пн", tue: "Вт", wed: "Ср", thu: "Чт", fri: "Пт", sat: "Сб", sun: "Вс",
};

function fmt(d: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "short", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
  }).format(d);
}

function scheduleText(daysCsv: string | null, time: string | null) {
  const days = (daysCsv ?? "").split(",").map((d) => DAY_LABELS[d.trim()]).filter(Boolean).join(", ");
  return [days, time].filter(Boolean).join(" · ");
}

export default async function TeacherDashboard() {
  const session = await getTeacherSession();
  const teacherId = session!.user.id;
  const now = new Date();

  const enrollments = await prisma.enrollment.findMany({
    where: { teacherId },
    orderBy: { createdAt: "asc" },
    include: {
      child: {
        select: {
          name: true,
          avatarColor: true,
          achievements: { orderBy: { earnedAt: "desc" }, select: { id: true, title: true } },
        },
      },
      lessons: {
        where: { startsAt: { gte: new Date(now.getTime() - 2 * 3600_000) } },
        orderBy: { startsAt: "asc" },
      },
    },
  });

  const upcoming = enrollments
    .flatMap((e) => e.lessons.map((l) => ({ l, e })))
    .filter((x) => x.l.startsAt >= now)
    .sort((a, b) => a.l.startsAt.getTime() - b.l.startsAt.getTime());

  const childrenCount = new Set(enrollments.map((e) => e.childId)).size;

  const stats = [
    { label: "Учеников", value: String(childrenCount), accent: "text-brand-blue" },
    { label: "Направлений", value: String(enrollments.length), accent: "text-brand-pink" },
    { label: "Занятий впереди", value: String(upcoming.length), accent: "text-brand-orange" },
  ];

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="section-title text-[2rem] sm:text-[2.4rem]">Мой кабинет</h1>
        <p className="mt-2 text-base font-medium text-ink/60">Ваши ученики, расписание и Zoom-ссылки.</p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[20px] border border-white/80 bg-white/85 p-4 shadow-card backdrop-blur-xl">
            <p className={`font-display text-2xl font-extrabold sm:text-3xl ${s.accent}`}>{s.value}</p>
            <p className="mt-1 text-xs font-extrabold leading-5 text-ink/56 sm:text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Моё расписание */}
      <section className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl sm:p-6">
        <h2 className="font-display text-xl font-extrabold text-ink">Ближайшие занятия</h2>
        <div className="mt-4 grid gap-3">
          {upcoming.length === 0 && (
            <p className="rounded-[16px] bg-ink/[0.02] px-4 py-6 text-center text-sm font-bold text-ink/50">Запланированных занятий нет — добавьте ниже.</p>
          )}
          {upcoming.slice(0, 6).map(({ l, e }) => {
            const join = l.joinUrl || e.zoomUrl;
            return (
              <div key={l.id} className="flex items-center gap-3 rounded-[16px] border border-ink/6 bg-white px-4 py-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black text-white ${e.child.avatarColor ?? "bg-brand-blue"}`}>
                  {e.child.name.slice(0, 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-ink">{e.child.name} · {e.directionTitle}</p>
                  <p className="truncate text-xs font-bold text-ink/52">{l.topic ?? "Занятие"}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className="text-right text-xs font-extrabold text-ink/64">{fmt(l.startsAt)}</span>
                  {join && (
                    <a href={join} target="_blank" rel="noopener" className="rounded-full bg-brand-blue px-3 py-1.5 text-xs font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-brand-blue/90">
                      Подключиться
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Мои ученики / записи */}
      <section className="grid gap-4">
        <h2 className="font-display text-xl font-extrabold text-ink">Мои ученики</h2>
        {enrollments.length === 0 && (
          <p className="rounded-[20px] border border-white/80 bg-white/70 px-5 py-8 text-center text-sm font-bold text-ink/50">
            Пока на вас не назначено записей. Их назначает администратор.
          </p>
        )}
        {enrollments.map((e) => (
          <div key={e.id} className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl sm:p-6">
            <div className="flex items-center gap-3">
              <span className={`flex h-11 w-11 items-center justify-center rounded-full text-base font-black text-white ${e.child.avatarColor ?? "bg-brand-blue"}`}>
                {e.child.name.slice(0, 1)}
              </span>
              <div>
                <p className="font-display text-lg font-extrabold text-ink">{e.child.name} · {e.directionTitle}</p>
                <p className="text-xs font-bold text-ink/52">
                  {e.format === "individual" ? "индивидуально" : "группа"}
                  {scheduleText(e.daysOfWeek, e.time) ? ` · ${scheduleText(e.daysOfWeek, e.time)}` : ""}
                </p>
              </div>
            </div>

            {/* Прогресс */}
            <form action={teacherSetProgress} className="mt-4 flex flex-wrap items-end gap-3">
              <input type="hidden" name="enrollmentId" value={e.id} />
              <div className="min-w-[180px] flex-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/44">Прогресс ученика</label>
                  <span className="text-xs font-extrabold text-ink/64">{e.progress}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/8">
                  <div className="h-full rounded-full bg-brand-blue" style={{ width: `${e.progress}%` }} />
                </div>
              </div>
              <input type="number" name="progress" min="0" max="100" defaultValue={e.progress} className="field-input h-[44px] w-24" />
              <button type="submit" className="secondary-btn h-[44px] min-h-0 px-4 py-0">Сохранить %</button>
            </form>

            {/* Zoom-ссылка */}
            <form action={teacherSetZoom} className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
              <input type="hidden" name="enrollmentId" value={e.id} />
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/44">Zoom-ссылка занятий</label>
                <input name="zoomUrl" defaultValue={e.zoomUrl ?? ""} placeholder="https://zoom.us/j/..." className="field-input mt-1 h-[48px]" />
              </div>
              <button type="submit" className="secondary-btn h-[48px] min-h-0 px-5 py-0">Сохранить</button>
            </form>

            {/* Добавить занятие */}
            <form action={teacherAddLesson} className="mt-3 grid gap-2 rounded-[16px] bg-ink/[0.02] p-3 sm:grid-cols-[auto_1fr_auto] sm:items-end">
              <input type="hidden" name="enrollmentId" value={e.id} />
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/44">Дата и время</label>
                <input type="datetime-local" name="startsAt" required className="field-input mt-1 h-[46px]" />
              </div>
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/44">Тема</label>
                <input name="topic" placeholder="Тема занятия" className="field-input mt-1 h-[46px]" />
              </div>
              <button type="submit" className="primary-btn h-[46px] min-h-0 px-5 py-0">Добавить</button>
            </form>

            {/* Занятия */}
            {e.lessons.length > 0 && (
              <div className="mt-3 grid gap-2">
                {e.lessons.map((l) => (
                  <div key={l.id} className="flex flex-wrap items-center justify-between gap-2 rounded-[14px] border border-ink/6 bg-white px-4 py-2.5">
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-ink">{fmt(l.startsAt)}</p>
                      <p className="truncate text-xs font-bold text-ink/52">{l.topic ?? "Занятие"}</p>
                    </div>
                    <form action={teacherDeleteLesson}>
                      <input type="hidden" name="lessonId" value={l.id} />
                      <button type="submit" className="text-xs font-extrabold text-ink/40 transition hover:text-brand-red">Удалить</button>
                    </form>
                  </div>
                ))}
              </div>
            )}

            {/* Достижения */}
            <div className="mt-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/44">Достижения</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {e.child.achievements.map((a) => (
                  <form key={a.id} action={teacherDeleteAchievement} className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/12 px-3 py-1.5 text-xs font-extrabold text-brand-orange">
                    <input type="hidden" name="achievementId" value={a.id} />
                    <span>🏅 {a.title}</span>
                    <button type="submit" title="Удалить достижение" className="leading-none text-brand-orange/55 transition hover:text-brand-red">×</button>
                  </form>
                ))}
                {e.child.achievements.length === 0 && <span className="text-xs font-bold text-ink/40">Пока нет</span>}
              </div>
              <form action={teacherAddAchievement} className="mt-2 flex gap-2">
                <input type="hidden" name="enrollmentId" value={e.id} />
                <input name="title" placeholder="Например: Освоил счёт до 100" className="field-input h-[44px] flex-1" />
                <button type="submit" className="secondary-btn h-[44px] min-h-0 px-4 py-0">Добавить</button>
              </form>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
