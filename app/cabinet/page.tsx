import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { getCabinetData } from "@/lib/cabinet";
import { DIRECTIONS, isDirectionSlug, type DirectionSlug } from "@/lib/subscription";

const COURSE_VISUALS: Record<
  DirectionSlug,
  { kicker: string; description: string; gradient: string; glow: string }
> = {
  risovanie: {
    kicker: "Творческая мастерская",
    description: "Пошаговые уроки, голосовое сопровождение и сотни идей для детского портфолио.",
    gradient: "from-[#246BFD] via-[#7257E8] to-[#EC4899]",
    glow: "bg-brand-pink/35",
  },
  "mentalnaya-arifmetika": {
    kicker: "Тренировка мышления",
    description: "Игровые занятия для внимания, памяти и уверенного счёта в уме.",
    gradient: "from-[#079A78] via-[#16A6A1] to-[#3B82F6]",
    glow: "bg-brand-cyan/30",
  },
  "podgotovka-k-shkole": {
    kicker: "Экспедиция в Город знаний",
    description: "Сюжетные миссии на речь, счёт, внимание, самостоятельность и спокойную готовность к школе.",
    gradient: "from-[#246BFD] via-[#7257E8] to-[#F05A87]",
    glow: "bg-brand-purple/30",
  },
};

function rub(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}
function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function openedDirectionsLabel(count: number) {
  if (count === 1) return "1 направление открыто";
  if (count === 2) return "2 направления открыты";
  return `${count} направлений открыто`;
}

function CourseIcon({ slug }: { slug: DirectionSlug }) {
  if (slug === "risovanie") {
    return (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 5.5l4 4M4 20l4.2-1 10.6-10.6a2.8 2.8 0 10-4-4L4.2 15 4 20z" />
        <path d="M12.5 7.5l4 4" />
      </svg>
    );
  }

  if (slug === "podgotovka-k-shkole") {
    return (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8.5L12 4l8 4.5-8 4.5-8-4.5z" />
        <path d="M7 11v4.5c2.8 2 7.2 2 10 0V11M20 9v5" />
      </svg>
    );
  }

  return (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="4" />
      <path d="M7 9h10M8 14h.01M12 14h.01M16 14h.01" />
    </svg>
  );
}

export default async function CabinetOverview() {
  const session = await getAuthSession();
  if (!session?.user?.id) redirect("/login?callbackUrl=/cabinet");

  const { children, payments, achievementsCount, accessMap } = await getCabinetData(session.user.id);
  const now = new Date();
  const directionAccess = (Object.keys(DIRECTIONS) as DirectionSlug[]).map((slug) => {
    const until = accessMap[slug];
    return {
      slug,
      meta: DIRECTIONS[slug],
      until,
      active: Boolean(until && until.getTime() > now.getTime()),
    };
  });
  const activeDirections = directionAccess.filter((direction) => direction.active);
  const lockedDirections = directionAccess.filter((direction) => !direction.active);
  const greetingName = session.user.name?.trim().split(/\s+/)[0];

  return (
    <div className="grid gap-7 pb-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex rounded-full border border-brand-blue/14 bg-white/70 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-blue shadow-sm backdrop-blur-xl">
            Личный кабинет
          </span>
          <h1 className="mt-4 font-display text-[2.25rem] font-extrabold leading-[1.03] tracking-[-0.04em] text-[#0b1f3a] sm:text-[3.2rem]">
            {greetingName ? `${greetingName}, продолжим?` : "Продолжим заниматься?"}
          </h1>
          <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-ink/60 sm:text-lg">
            Здесь начинается обучение: выбирайте направление и сразу переходите к урокам.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full border border-white/80 bg-white/80 px-4 py-2 text-xs font-extrabold text-ink/60 shadow-sm">
            {openedDirectionsLabel(activeDirections.length)}
          </span>
          {achievementsCount > 0 && (
            <span className="rounded-full border border-brand-orange/16 bg-brand-orange/8 px-4 py-2 text-xs font-extrabold text-brand-orange">
              {achievementsCount} достижений
            </span>
          )}
        </div>
      </header>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-pink">Ваши занятия</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold tracking-[-0.025em] text-ink sm:text-3xl">
              {activeDirections.length > 0 ? "Продолжить обучение" : "Начните с первого урока"}
            </h2>
          </div>
        </div>

        {activeDirections.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {activeDirections.map(({ slug, meta, until }) => {
              const visual = COURSE_VISUALS[slug];
              return (
                <article
                  key={slug}
                  className={`group relative isolate min-h-[320px] overflow-hidden rounded-[32px] bg-gradient-to-br ${visual.gradient} p-6 text-white shadow-color sm:p-8`}
                >
                  <div className={`pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full ${visual.glow} blur-3xl transition duration-500 group-hover:scale-125`} />
                  <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-white/16 blur-3xl" />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/18 bg-white/16 shadow-insetline backdrop-blur-xl">
                        <CourseIcon slug={slug} />
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/16 px-3 py-1.5 text-xs font-extrabold backdrop-blur-xl">
                        <span className="h-2 w-2 rounded-full bg-[#78F0A3] shadow-[0_0_0_4px_rgba(120,240,163,0.16)]" />
                        Доступ открыт
                      </span>
                    </div>

                    <div className="mt-8">
                      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/68">{visual.kicker}</p>
                      <h3 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">{meta.title}</h3>
                      <p className="mt-3 max-w-md text-sm font-semibold leading-6 text-white/76 sm:text-base">{visual.description}</p>
                    </div>

                    <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs font-bold text-white/66">
                        {until ? `Доступ до ${formatDate(until)}` : "Полный доступ активен"}
                      </p>
                      <Link
                        href={`${meta.path}#uroki`}
                        className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-extrabold text-[#17233d] shadow-[0_16px_36px_rgba(11,31,58,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(11,31,58,0.24)]"
                      >
                        Перейти к урокам
                        <span aria-hidden="true" className="ml-2 text-lg">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="dark-rainbow relative overflow-hidden rounded-[32px] p-6 text-white shadow-luxe sm:p-9">
            <div className="relative max-w-2xl">
              <span className="inline-flex rounded-full border border-white/14 bg-white/10 px-3 py-1.5 text-xs font-extrabold text-white/78">
                Бесплатный старт
              </span>
              <h3 className="mt-5 font-display text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">Попробуйте урок рисования прямо сейчас</h3>
              <p className="mt-3 text-base font-medium leading-7 text-white/68">
                Первые уроки доступны без оплаты. Ребёнок сразу увидит понятные шаги и начнёт рисовать.
              </p>
              <Link href="/risovanie#uroki" className="mt-7 inline-flex min-h-[54px] items-center rounded-full bg-white px-7 py-3 text-sm font-extrabold text-night shadow-color transition hover:-translate-y-1">
                Открыть бесплатные уроки <span className="ml-2 text-lg">→</span>
              </Link>
            </div>
          </div>
        )}
      </section>

      {lockedDirections.length > 0 && (
        <section className="rounded-[30px] border border-white/80 bg-white/78 p-5 shadow-card backdrop-blur-xl sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-purple">Следующий шаг</p>
              <h2 className="mt-1 font-display text-2xl font-extrabold tracking-[-0.025em] text-ink">Другие направления</h2>
            </div>
            <p className="text-sm font-semibold text-ink/50">Первые уроки можно попробовать бесплатно</p>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {lockedDirections.map(({ slug, meta }) => {
              const visual = COURSE_VISUALS[slug];
              return (
                <article key={slug} className={'group relative isolate flex min-h-[265px] flex-col overflow-hidden rounded-[26px] bg-gradient-to-br ' + visual.gradient + ' p-5 text-white shadow-color transition duration-300 hover:-translate-y-1 hover:shadow-luxe'}>
                  <div className={'pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full ' + visual.glow + ' blur-3xl transition duration-500 group-hover:scale-125'} />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-[17px] border border-white/18 bg-white/16 text-white shadow-sm backdrop-blur-xl">
                        <CourseIcon slug={slug} />
                      </span>
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/62">{visual.kicker}</p>
                        <h3 className="font-display text-xl font-extrabold text-white">{meta.title}</h3>
                      </div>
                    </div>
                    <p className="mt-5 text-sm font-semibold leading-6 text-white/74">{visual.description}</p>
                    <div className="mt-auto pt-6">
                      <Link href={meta.path} scroll className="inline-flex min-h-[46px] items-center rounded-full bg-white px-5 py-2.5 text-xs font-extrabold text-ink shadow-sm transition hover:-translate-y-0.5">
                        Посмотреть курс →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[28px] border border-white/80 bg-white/78 p-5 shadow-card backdrop-blur-xl sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-extrabold text-ink">Профили детей</h2>
                {children.length === 0 && (
                  <span className="rounded-full bg-ink/6 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-ink/44">Необязательно</span>
                )}
              </div>
              <p className="mt-1 text-sm font-medium leading-6 text-ink/50">Для личного прогресса и достижений каждого ребёнка.</p>
            </div>
            <Link href="/cabinet/children" className="shrink-0 text-sm font-extrabold text-brand-blue hover:text-brand-blue/70">
              Управлять →
            </Link>
          </div>
          {children.length === 0 ? (
            <Link href="/cabinet/children" className="mt-5 flex items-center justify-between rounded-[20px] border border-dashed border-brand-blue/24 bg-brand-blue/[0.04] px-5 py-5 transition hover:border-brand-blue/42 hover:bg-brand-blue/[0.07]">
              <span>
                <span className="block text-sm font-extrabold text-ink">Добавить ребёнка</span>
                <span className="mt-1 block text-xs font-semibold text-ink/48">Имя и возраст — займёт меньше минуты</span>
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue text-xl font-bold text-white">+</span>
            </Link>
          ) : (
            <div className="mt-5 grid gap-2">
              {children.slice(0, 3).map((child) => (
                <div key={child.id} className="flex items-center gap-3 rounded-[18px] border border-ink/6 bg-white px-4 py-3">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] text-sm font-black text-white ${child.avatarColor ?? "bg-brand-blue"}`}>
                    {child.name.slice(0, 1)}
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-ink">{child.name}</p>
                    <p className="text-xs font-semibold text-ink/46">{child.achievements.length} достижений</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-[28px] border border-white/80 bg-white/78 p-5 shadow-card backdrop-blur-xl sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-extrabold text-ink">Оплаты и чеки</h2>
              <p className="mt-1 text-sm font-medium leading-6 text-ink/50">Статусы последних операций.</p>
            </div>
            <Link href="/cabinet/payments" className="shrink-0 text-sm font-extrabold text-brand-blue hover:text-brand-blue/70">
              Все оплаты →
            </Link>
          </div>
          <div className="mt-5 grid gap-2">
            {payments.length === 0 && (
              <p className="rounded-[18px] bg-ink/[0.025] px-4 py-6 text-center text-sm font-bold text-ink/46">Оплат пока нет.</p>
            )}
            {payments.slice(0, 3).map((payment) => {
              const direction = isDirectionSlug(payment.directionSlug) ? DIRECTIONS[payment.directionSlug] : null;
              return (
                <div key={payment.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-ink/6 bg-white px-4 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold text-ink">{payment.description ?? "Оплата"}</p>
                    <p className="mt-1 text-xs font-semibold text-ink/46">{formatDate(payment.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-ink">{rub(payment.amount)}</span>
                    <PaymentBadge status={payment.status} />
                    {payment.status === "paid" && direction && (
                      <Link href={`${direction.path}#uroki`} className="rounded-full bg-brand-green/12 px-3 py-1.5 text-[11px] font-extrabold text-brand-green transition hover:bg-brand-green/18">
                        К урокам →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    paid: { label: "Оплачено", cls: "bg-brand-green/12 text-brand-green" },
    pending: { label: "Проверяем", cls: "bg-brand-orange/12 text-brand-orange" },
    failed: { label: "Ошибка", cls: "bg-brand-red/12 text-brand-red" },
    refunded: { label: "Возврат", cls: "bg-ink/8 text-ink/60" },
  };
  const item = map[status] ?? map.pending;
  return <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${item.cls}`}>{item.label}</span>;
}
