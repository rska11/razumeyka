import { prisma } from "@/lib/prisma";
import { setZoom, addLesson, deleteLesson } from "./actions";
import { assignTeacher } from "../teachers/actions";

function fmt(d: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  }).format(d);
}

const STATUS: Record<string, string> = {
  active: "активна", pending: "ожидает оплаты", paused: "пауза", finished: "завершена",
};

export default async function AdminLessonsPage() {
  const now = new Date();
  const [enrollments, teachers] = await Promise.all([
    prisma.enrollment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        child: { include: { parent: { select: { email: true } } } },
        teacher: { select: { id: true, name: true, email: true } },
        lessons: { where: { startsAt: { gte: new Date(now.getTime() - 2 * 3600_000) } }, orderBy: { startsAt: "asc" } },
      },
    }),
    prisma.user.findMany({ where: { role: "teacher", isBlocked: false }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="section-title text-[2rem] sm:text-[2.4rem]">Занятия и расписание</h1>
        <p className="mt-2 text-base font-medium text-ink/60">
          Задайте Zoom-ссылку для записи и добавляйте занятия — родитель увидит их в кабинете с кнопкой «Подключиться».
        </p>
      </header>

      {enrollments.length === 0 && (
        <p className="rounded-[20px] border border-white/80 bg-white/70 px-5 py-8 text-center text-sm font-bold text-ink/50">
          Пока нет записей на направления. Они появятся, когда родитель запишет ребёнка.
        </p>
      )}

      {enrollments.map((e) => (
        <section key={e.id} className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-display text-lg font-extrabold text-ink">
                {e.child.name} · {e.directionTitle}
              </p>
              <p className="text-xs font-bold text-ink/52">
                {e.child.parent?.email} · {e.format === "individual" ? "индивидуально" : "группа"} · {STATUS[e.status] ?? e.status}
              </p>
            </div>
          </div>

          {/* Назначение преподавателя */}
          <form action={assignTeacher} className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
            <input type="hidden" name="enrollmentId" value={e.id} />
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/44">Преподаватель</label>
              <select name="teacherId" defaultValue={e.teacherId ?? ""} className="field-input mt-1 h-[48px]">
                <option value="">— не назначен —</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name || t.email}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="secondary-btn h-[48px] min-h-0 px-5 py-0">Назначить</button>
          </form>

          {/* Постоянная Zoom-ссылка записи */}
          <form action={setZoom} className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
            <input type="hidden" name="enrollmentId" value={e.id} />
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/44">Постоянная Zoom-ссылка</label>
              <input name="zoomUrl" defaultValue={e.zoomUrl ?? ""} placeholder="https://zoom.us/j/..." className="field-input mt-1 h-[48px]" />
            </div>
            <button type="submit" className="secondary-btn h-[48px] min-h-0 px-5 py-0">Сохранить ссылку</button>
          </form>

          {/* Добавить занятие */}
          <form action={addLesson} className="mt-3 grid gap-2 rounded-[16px] bg-ink/[0.02] p-3 sm:grid-cols-[auto_1fr_1fr_auto] sm:items-end">
            <input type="hidden" name="enrollmentId" value={e.id} />
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/44">Дата и время</label>
              <input type="datetime-local" name="startsAt" required className="field-input mt-1 h-[46px]" />
            </div>
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/44">Тема</label>
              <input name="topic" placeholder="Например: Сложение на абакусе" className="field-input mt-1 h-[46px]" />
            </div>
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/44">Ссылка (если другая)</label>
              <input name="joinUrl" placeholder="необязательно" className="field-input mt-1 h-[46px]" />
            </div>
            <button type="submit" className="primary-btn h-[46px] min-h-0 px-5 py-0">Добавить</button>
          </form>

          {/* Ближайшие занятия */}
          {e.lessons.length > 0 && (
            <div className="mt-3 grid gap-2">
              {e.lessons.map((l) => (
                <div key={l.id} className="flex flex-wrap items-center justify-between gap-2 rounded-[14px] border border-ink/6 bg-white px-4 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-ink">{fmt(l.startsAt)}</p>
                    <p className="truncate text-xs font-bold text-ink/52">
                      {l.topic ?? "Занятие"}{l.joinUrl ? " · своя ссылка" : e.zoomUrl ? " · ссылка записи" : " · ссылки нет"}
                    </p>
                  </div>
                  <form action={deleteLesson}>
                    <input type="hidden" name="lessonId" value={l.id} />
                    <button type="submit" className="text-xs font-extrabold text-ink/40 transition hover:text-brand-red">Удалить</button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
