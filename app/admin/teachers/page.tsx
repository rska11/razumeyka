import { prisma } from "@/lib/prisma";
import { addTeacher, toggleTeacherBlocked } from "./actions";

export default async function AdminTeachersPage() {
  const teachers = await prisma.user.findMany({
    where: { role: "teacher" },
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { taughtEnrollments: true } } },
  });

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="section-title text-[2rem] sm:text-[2.4rem]">Преподаватели</h1>
        <p className="mt-2 text-base font-medium text-ink/60">
          Добавьте преподавателя по email — он войдёт по коду и увидит свой кабинет. Назначайте преподов на записи в разделе «Занятия».
        </p>
      </header>

      <section className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl sm:p-6">
        <h2 className="font-display text-lg font-extrabold text-ink">Добавить преподавателя</h2>
        <form action={addTeacher} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div>
            <label className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/44">Имя</label>
            <input name="name" placeholder="Имя преподавателя" className="field-input mt-1 h-[48px]" />
          </div>
          <div>
            <label className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/44">Email</label>
            <input name="email" type="email" required placeholder="teacher@example.com" className="field-input mt-1 h-[48px]" />
          </div>
          <button type="submit" className="primary-btn h-[48px] min-h-0 px-6 py-0">Добавить</button>
        </form>
      </section>

      <section className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl sm:p-6">
        <h2 className="font-display text-lg font-extrabold text-ink">Список ({teachers.length})</h2>
        <div className="mt-4 grid gap-2">
          {teachers.length === 0 && (
            <p className="rounded-[16px] bg-ink/[0.02] px-4 py-6 text-center text-sm font-bold text-ink/50">Преподавателей пока нет.</p>
          )}
          {teachers.map((t) => (
            <div key={t.id} className={`flex flex-wrap items-center justify-between gap-2 rounded-[16px] border border-ink/6 bg-white px-4 py-3 ${t.isBlocked ? "opacity-55" : ""}`}>
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-ink">{t.name || t.email}</p>
                <p className="text-xs font-bold text-ink/52">
                  {t.email} · записей: {t._count.taughtEnrollments}{t.isBlocked ? " · деактивирован" : ""}
                </p>
              </div>
              <form action={toggleTeacherBlocked}>
                <input type="hidden" name="teacherId" value={t.id} />
                <input type="hidden" name="block" value={t.isBlocked ? "false" : "true"} />
                <button type="submit" className={`rounded-full border px-3 py-2 text-xs font-extrabold transition ${t.isBlocked ? "border-brand-green/30 text-brand-green hover:bg-brand-green/8" : "border-ink/12 text-ink/55 hover:border-brand-red/30 hover:text-brand-red"}`}>
                  {t.isBlocked ? "Активировать" : "Деактивировать"}
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
