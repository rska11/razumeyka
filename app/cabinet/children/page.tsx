import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { getCabinetData } from "@/lib/cabinet";
import { directionsData } from "@/data/directions.js";
import { enrollmentPrice, rub } from "@/lib/pricing";
import { PayButton } from "@/components/cabinet/PayButton.jsx";
import { addChild, deleteChild, addEnrollment, removeEnrollment } from "../actions";

const TARIFFS: Record<string, string> = { "1m": "1 месяц", "3m": "3 месяца", "6m": "6 месяцев" };
const STATUS: Record<string, { label: string; cls: string }> = {
  active: { label: "Активно", cls: "bg-brand-green/12 text-brand-green" },
  pending: { label: "Ожидает оплаты", cls: "bg-brand-orange/12 text-brand-orange" },
  paused: { label: "Пауза", cls: "bg-ink/8 text-ink/60" },
  finished: { label: "Завершено", cls: "bg-brand-blue/12 text-brand-blue" },
};

export default async function ChildrenPage() {
  const session = await getAuthSession();
  if (!session?.user?.id) redirect("/login?callbackUrl=/cabinet");
  const { children } = await getCabinetData(session.user.id);
  const directions = directionsData as { slug: string; title: string }[];

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="section-title text-[2rem] sm:text-[2.4rem]">Дети</h1>
          <p className="mt-2 text-base font-medium text-ink/60">Профили детей, их направления и прогресс.</p>
        </div>
      </header>

      {/* Добавить ребёнка */}
      <section className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl sm:p-6">
        <h2 className="font-display text-lg font-extrabold text-ink">Добавить ребёнка</h2>
        <form action={addChild} className="mt-4 grid gap-3 sm:grid-cols-[1.4fr_0.8fr_auto] sm:items-end">
          <div>
            <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/46">Имя</label>
            <input name="name" required placeholder="Имя ребёнка" className="field-input" />
          </div>
          <div>
            <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/46">Год рождения</label>
            <input name="birthYear" inputMode="numeric" placeholder="2017" className="field-input" />
          </div>
          <button type="submit" className="primary-btn h-[54px]">Добавить</button>
        </form>
      </section>

      {children.length === 0 && (
        <p className="rounded-[20px] border border-white/80 bg-white/70 px-5 py-8 text-center text-sm font-bold text-ink/50">
          Пока нет ни одного профиля. Добавьте ребёнка выше.
        </p>
      )}

      {children.map((child) => (
        <section key={child.id} className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-black text-white ${child.avatarColor ?? "bg-brand-blue"}`}>
                {child.name.slice(0, 1)}
              </span>
              <div>
                <p className="font-display text-xl font-extrabold text-ink">{child.name}</p>
                {child.birthYear && <p className="text-xs font-bold text-ink/52">{child.birthYear} г. р.</p>}
              </div>
            </div>
            <form action={deleteChild}>
              <input type="hidden" name="childId" value={child.id} />
              <button type="submit" className="rounded-full border border-ink/10 px-3 py-2 text-xs font-extrabold text-ink/50 transition hover:border-brand-red/30 hover:text-brand-red">
                Удалить
              </button>
            </form>
          </div>

          {/* Направления */}
          <div className="mt-5 grid gap-3">
            {child.enrollments.map((e) => {
              const st = STATUS[e.status] ?? STATUS.pending;
              return (
                <div key={e.id} className="rounded-[18px] border border-ink/6 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-extrabold text-ink">{e.directionTitle}</p>
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${st.cls}`}>{st.label}</span>
                    </div>
                    <form action={removeEnrollment}>
                      <input type="hidden" name="enrollmentId" value={e.id} />
                      <button type="submit" className="text-xs font-extrabold text-ink/40 transition hover:text-brand-red">Снять запись</button>
                    </form>
                  </div>
                  <p className="mt-1 text-xs font-bold text-ink/52">
                    {e.format === "individual" ? "Индивидуально" : "Коллективно"} · {TARIFFS[e.tariff ?? ""] ?? "—"}
                    {e.time ? ` · ${e.time}` : ""}
                  </p>
                  <div className="mt-2.5 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/8">
                      <div className="h-full rounded-full bg-brand-blue" style={{ width: `${e.progress}%` }} />
                    </div>
                    <span className="text-xs font-extrabold text-ink/64">{e.progress}%</span>
                  </div>
                  {e.status === "pending" && enrollmentPrice(e.format, e.tariff) > 0 && (
                    <div className="mt-3">
                      <PayButton enrollmentId={e.id} label={`Оплатить ${rub(enrollmentPrice(e.format, e.tariff))}`} />
                    </div>
                  )}
                </div>
              );
            })}
            {child.enrollments.length === 0 && (
              <p className="rounded-[16px] bg-ink/[0.02] px-4 py-4 text-center text-xs font-bold text-ink/50">Нет записей на направления.</p>
            )}
          </div>

          {child.achievements.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/44">Достижения</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {child.achievements.map((a) => (
                  <span key={a.id} className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/12 px-3 py-1.5 text-xs font-extrabold text-brand-orange">🏅 {a.title}</span>
                ))}
              </div>
            </div>
          )}

          {/* Записать на направление */}
          <form action={addEnrollment} className="mt-4 grid gap-2 rounded-[18px] bg-ink/[0.02] p-3 sm:grid-cols-[1.4fr_1fr_0.8fr_auto] sm:items-end">
            <input type="hidden" name="childId" value={child.id} />
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/44">Направление</label>
              <select name="directionSlug" required className="field-input mt-1 h-[48px]">
                {directions.map((d) => (
                  <option key={d.slug} value={d.slug}>{d.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/44">Формат</label>
              <select name="format" className="field-input mt-1 h-[48px]">
                <option value="collective">Коллективно</option>
                <option value="individual">Индивидуально</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink/44">Тариф</label>
              <select name="tariff" className="field-input mt-1 h-[48px]">
                <option value="1m">1 месяц</option>
                <option value="3m">3 месяца</option>
                <option value="6m">6 месяцев</option>
              </select>
            </div>
            <button type="submit" className="secondary-btn h-[48px] min-h-0 px-5 py-0">Записать</button>
          </form>
        </section>
      ))}
    </div>
  );
}
