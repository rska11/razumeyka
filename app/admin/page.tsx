import { prisma } from "@/lib/prisma";
import { isAuthDisabled } from "@/lib/settings";
import { getAuthSession } from "@/lib/auth";
import { DIRECTIONS, getAccessMap, type DirectionSlug } from "@/lib/subscription";
import { directionsData } from "@/data/directions.js";
import { landingsData } from "@/data/landings.js";
import { toggleAuth, unlockAllForMe, lockAllForMe, grantAccessToUser, revokeAccessFromUser } from "./actions";

// Читаемое название направления по слагу (для листа ожидания — там слаги неоткрытых направлений).
function directionLabel(slug: string): string {
  return (
    directionsData.find((d: { slug: string; title?: string }) => d.slug === slug)?.title ??
    landingsData.find((l: { slug: string; h1?: string }) => l.slug === slug)?.h1 ??
    slug
  );
}

function rub(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}
function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", year: "numeric" }).format(d);
}

const STATUS: Record<string, string> = {
  active: "активно", pending: "ожидает", paused: "пауза", finished: "завершено",
  paid: "оплачено", failed: "ошибка", refunded: "возврат",
};

export default async function AdminPage() {
  const session = await getAuthSession();
  const myAccess = session?.user?.id ? await getAccessMap(session.user.id) : null;
  const now = Date.now();
  const myUnlocked = myAccess
    ? (Object.keys(DIRECTIONS) as DirectionSlug[]).map((slug) => ({
        title: DIRECTIONS[slug].title,
        active: Boolean(myAccess[slug] && myAccess[slug]!.getTime() > now),
      }))
    : [];
  const allMineUnlocked = myUnlocked.length > 0 && myUnlocked.every((d) => d.active);
  const anyMineUnlocked = myUnlocked.some((d) => d.active);

  const [authDisabled, users, payments, accesses, waitlist] = await Promise.all([
    isAuthDisabled(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { children: { include: { enrollments: true } } },
    }),
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { email: true } } },
    }),
    prisma.access.findMany({
      orderBy: { until: "desc" },
      include: { user: { select: { email: true } } },
    }),
    prisma.waitlist.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  // Карта доступов по пользователям: userId → { direction → until }
  const accessByUser = new Map<string, Partial<Record<DirectionSlug, Date>>>();
  for (const a of accesses) {
    const dir = a.direction as DirectionSlug;
    if (!DIRECTIONS[dir]) continue;
    const cur = accessByUser.get(a.userId) ?? {};
    cur[dir] = a.until;
    accessByUser.set(a.userId, cur);
  }
  const activeAccesses = accesses
    .filter((a) => a.until.getTime() > now && DIRECTIONS[a.direction as DirectionSlug])
    .sort((a, b) => a.until.getTime() - b.until.getTime());

  // Лист ожидания, сгруппированный по направлениям (по убыванию числа ожидающих).
  const waitlistByDirection = new Map<string, typeof waitlist>();
  for (const w of waitlist) {
    const arr = waitlistByDirection.get(w.direction) ?? [];
    arr.push(w);
    waitlistByDirection.set(w.direction, arr);
  }
  const waitlistGroups = [...waitlistByDirection.entries()]
    .map(([direction, entries]) => ({ direction, entries }))
    .sort((a, b) => b.entries.length - a.entries.length);

  const childrenCount = users.reduce((s, u) => s + u.children.length, 0);
  const enrollCount = users.reduce((s, u) => s + u.children.reduce((a, c) => a + c.enrollments.length, 0), 0);
  const paidTotal = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const directionSlugs = Object.keys(DIRECTIONS) as DirectionSlug[];

  const stats = [
    { label: "Родителей", value: String(users.length), accent: "text-brand-blue" },
    { label: "Детей", value: String(childrenCount), accent: "text-brand-pink" },
    { label: "Записей", value: String(enrollCount), accent: "text-brand-orange" },
    { label: "Оплачено", value: rub(paidTotal), accent: "text-brand-green" },
  ];

  return (
    <div className="grid gap-6">
      {/* Рубильник авторизации */}
      <section className={`rounded-[24px] border p-5 shadow-card backdrop-blur-xl sm:p-6 ${authDisabled ? "border-brand-orange/30 bg-brand-orange/[0.06]" : "border-brand-green/30 bg-brand-green/[0.05]"}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-xl font-extrabold text-ink">Авторизация на сайте</h2>
              <span className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] ${authDisabled ? "bg-brand-orange/15 text-brand-orange" : "bg-brand-green/15 text-brand-green"}`}>
                {authDisabled ? "Выключена" : "Включена"}
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-ink/64">
              {authDisabled
                ? "Кнопка «Войти» скрыта, вход и регистрация закрыты для всех (кроме админов). Режим доработки сайта."
                : "Кнопка «Войти» видна, родители могут входить и регистрироваться."}
            </p>
          </div>
          <form action={toggleAuth}>
            <input type="hidden" name="disabled" value={authDisabled ? "false" : "true"} />
            <button
              type="submit"
              className={`inline-flex min-h-[52px] items-center gap-2 rounded-full px-6 py-3 text-base font-extrabold text-white shadow-color transition hover:-translate-y-0.5 ${authDisabled ? "bg-brand-green hover:bg-brand-green/90" : "bg-brand-orange hover:bg-brand-orange/90"}`}
            >
              {authDisabled ? "Включить вход" : "Выключить вход (режим доработки)"}
            </button>
          </form>
        </div>
      </section>

      {/* Тестовый доступ ко всем урокам — только для текущего админа */}
      <section className="rounded-[24px] border border-brand-blue/25 bg-brand-blue/[0.05] p-5 shadow-card backdrop-blur-xl sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-xl font-extrabold text-ink">Мой доступ к урокам (проверка)</h2>
              <span className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] ${allMineUnlocked ? "bg-brand-green/15 text-brand-green" : "bg-ink/8 text-ink/55"}`}>
                {allMineUnlocked ? "Разблокировано" : "Freemium"}
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-ink/64">
              Открывает все уроки всех направлений <b>только вам</b> (на год), чтобы проверить контент без оплаты. «Вернуть замки» — снова увидеть сайт глазами обычного пользователя (freemium). На других пользователей не влияет.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {myUnlocked.map((d) => (
                <span key={d.title} className={`rounded-full px-3 py-1 text-xs font-extrabold ${d.active ? "bg-brand-green/12 text-brand-green" : "bg-ink/8 text-ink/55"}`}>
                  {d.title}: {d.active ? "открыт" : "замок"}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <form action={unlockAllForMe}>
              <button
                type="submit"
                disabled={allMineUnlocked}
                className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-base font-extrabold text-white shadow-color transition hover:-translate-y-0.5 hover:bg-brand-blue/90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
              >
                {allMineUnlocked ? "Всё открыто" : "Разблокировать всё мне"}
              </button>
            </form>
            <form action={lockAllForMe}>
              <button
                type="submit"
                disabled={!anyMineUnlocked}
                className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-ink/12 bg-white/78 px-6 py-3 text-base font-extrabold text-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/78"
              >
                🔒 Вернуть замки (как у пользователя)
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Статистика */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[20px] border border-white/80 bg-white/85 p-4 shadow-card backdrop-blur-xl">
            <p className={`font-display text-2xl font-extrabold sm:text-3xl ${s.accent}`}>{s.value}</p>
            <p className="mt-1 text-xs font-extrabold leading-5 text-ink/56 sm:text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Активные доступы */}
      <section className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl sm:p-6">
        <h2 className="font-display text-xl font-extrabold text-ink">Активные доступы ({activeAccesses.length})</h2>
        <p className="mt-1 text-xs font-bold text-ink/52">Кто сейчас имеет открытый доступ и до какого числа. Выдать или продлить — на карточке родителя ниже.</p>
        <div className="mt-4 grid gap-2">
          {activeAccesses.length === 0 && (
            <p className="rounded-[16px] bg-ink/[0.02] px-4 py-6 text-center text-sm font-bold text-ink/50">Активных доступов нет.</p>
          )}
          {activeAccesses.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded-[16px] border border-ink/6 bg-white px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-ink">{a.user?.email ?? "—"}</p>
                <p className="text-xs font-bold text-ink/52">{DIRECTIONS[a.direction as DirectionSlug]?.title ?? a.direction}</p>
              </div>
              <span className="rounded-full bg-brand-green/12 px-2.5 py-1 text-[11px] font-extrabold text-brand-green">до {fmtDate(a.until)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Лист ожидания запуска */}
      <section className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl sm:p-6">
        <h2 className="font-display text-xl font-extrabold text-ink">Лист ожидания ({waitlist.length})</h2>
        <p className="mt-1 text-xs font-bold text-ink/52">Кто оставил email на «скоро»-направлениях. На запуске направления по ним делаем рассылку.</p>
        <div className="mt-4 grid gap-3">
          {waitlistGroups.length === 0 && (
            <p className="rounded-[16px] bg-ink/[0.02] px-4 py-6 text-center text-sm font-bold text-ink/50">Заявок в листе ожидания пока нет.</p>
          )}
          {waitlistGroups.map(({ direction, entries }) => (
            <details key={direction} className="rounded-[16px] border border-ink/6 bg-white px-4 py-3">
              <summary className="flex cursor-pointer items-center justify-between gap-2 text-sm font-extrabold text-ink">
                <span className="truncate">{directionLabel(direction)}</span>
                <span className="shrink-0 rounded-full bg-brand-orange/12 px-2.5 py-1 text-[11px] font-extrabold text-brand-orange">{entries.length} ждут</span>
              </summary>
              <div className="mt-3 grid gap-1.5">
                {entries.map((w) => (
                  <div key={w.id} className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate font-bold text-ink/72">{w.email}</span>
                    <span className="shrink-0 font-bold text-ink/40">{fmtDate(w.createdAt)}{w.notifiedAt ? " · уведомлён" : ""}</span>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Родители */}
      <section className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl sm:p-6">
        <h2 className="font-display text-xl font-extrabold text-ink">Родители ({users.length})</h2>
        <div className="mt-4 grid gap-3">
          {users.length === 0 && <p className="rounded-[16px] bg-ink/[0.02] px-4 py-6 text-center text-sm font-bold text-ink/50">Пока нет зарегистрированных родителей.</p>}
          {users.map((u) => (
            <div key={u.id} className="rounded-[16px] border border-ink/6 bg-white px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-extrabold text-ink">{u.email}</p>
                  {u.pdConsentAt ? (
                    <span title={`Согласие на обработку ПД: ${fmtDate(u.pdConsentAt)}`} className="shrink-0 rounded-full bg-brand-green/12 px-2.5 py-1 text-[11px] font-extrabold text-brand-green">
                      ПД ✓ {fmtDate(u.pdConsentAt)}
                    </span>
                  ) : (
                    <span title="Согласие на обработку ПД не зафиксировано (аккаунт создан до внедрения фиксации)" className="shrink-0 rounded-full bg-brand-orange/12 px-2.5 py-1 text-[11px] font-extrabold text-brand-orange">
                      ПД: нет отметки
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-ink/46">с {fmtDate(u.createdAt)}</span>
              </div>
              {u.children.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {u.children.map((c) => (
                    <span key={c.id} className="rounded-full bg-ink/[0.04] px-3 py-1 text-xs font-extrabold text-ink/70">
                      {c.name}
                      {c.enrollments.length > 0 && (
                        <span className="font-bold text-ink/44"> · {c.enrollments.map((e) => `${e.directionTitle} (${STATUS[e.status] ?? e.status})`).join(", ")}</span>
                      )}
                    </span>
                  ))}
                </div>
              )}

              {/* Управление доступом к направлениям */}
              <div className="mt-3 grid gap-2 border-t border-ink/6 pt-3 sm:grid-cols-2">
                {directionSlugs.map((slug) => {
                  const until = accessByUser.get(u.id)?.[slug];
                  const active = Boolean(until && until.getTime() > now);
                  return (
                    <div key={slug} className="flex flex-wrap items-center justify-between gap-2 rounded-[12px] bg-ink/[0.02] px-3 py-2">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-extrabold text-ink/72">{DIRECTIONS[slug].title}</p>
                        <p className="text-[11px] font-bold text-ink/46">{active ? `открыт до ${fmtDate(until!)}` : "нет доступа"}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <form action={grantAccessToUser}>
                          <input type="hidden" name="userId" value={u.id} />
                          <input type="hidden" name="direction" value={slug} />
                          <input type="hidden" name="months" value="1" />
                          <button type="submit" className="rounded-full bg-brand-blue px-3 py-1.5 text-[11px] font-extrabold text-white transition hover:bg-brand-blue/90">
                            {active ? "+1 мес" : "Открыть на 1 мес"}
                          </button>
                        </form>
                        {active && (
                          <form action={revokeAccessFromUser}>
                            <input type="hidden" name="userId" value={u.id} />
                            <input type="hidden" name="direction" value={slug} />
                            <button type="submit" className="rounded-full border border-ink/12 px-3 py-1.5 text-[11px] font-extrabold text-ink/55 transition hover:border-brand-red/30 hover:text-brand-red">
                              Отозвать
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Оплаты */}
      <section className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl sm:p-6">
        <h2 className="font-display text-xl font-extrabold text-ink">Все оплаты ({payments.length})</h2>
        <div className="mt-4 grid gap-2">
          {payments.length === 0 && <p className="rounded-[16px] bg-ink/[0.02] px-4 py-6 text-center text-sm font-bold text-ink/50">Оплат пока нет.</p>}
          {payments.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-[16px] border border-ink/6 bg-white px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-ink">{p.description ?? "Оплата"}</p>
                <p className="text-xs font-bold text-ink/52">{p.user?.email ?? "—"} · {fmtDate(p.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-extrabold text-ink">{rub(p.amount)}</span>
                <span className="rounded-full bg-ink/8 px-2.5 py-1 text-[11px] font-extrabold text-ink/64">{STATUS[p.status] ?? p.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
