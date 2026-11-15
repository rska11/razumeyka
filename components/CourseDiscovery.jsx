import Link from 'next/link';

const COURSES = {
  risovanie: {
    href: '/risovanie',
    title: 'Рисование',
    kicker: 'Творческая мастерская',
    description: 'Рисуем по шагам, развиваем воображение и собираем детское портфолио.',
    icon: '🎨',
    gradient: 'from-[#246BFD] via-[#7257E8] to-[#EC4899]',
  },
  'mentalnaya-arifmetika': {
    href: '/mentalnaya-arifmetika',
    title: 'Ментальная арифметика',
    kicker: 'Лаборатория чисел',
    description: 'Тренируем устный счёт, внимание и память через короткие игровые миссии.',
    icon: '🧮',
    gradient: 'from-[#079A78] via-[#16A6A1] to-[#3B82F6]',
  },
  'podgotovka-k-shkole': {
    href: '/podgotovka-k-shkole',
    title: 'Подготовка к школе',
    kicker: 'Город знаний',
    description: 'Развиваем речь, счёт, логику и самостоятельность перед первым классом.',
    icon: '🎒',
    gradient: 'from-[#246BFD] via-[#7257E8] to-[#F05A87]',
  },
};

export function CourseDiscovery({ current }) {
  const otherCourses = Object.entries(COURSES).filter(([slug]) => slug !== current);

  return (
    <aside className="mt-8 rounded-[30px] border border-white/80 bg-white/80 p-5 shadow-card backdrop-blur-xl sm:p-7">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-purple">Другие приключения</p>
        <h2 className="mt-1 font-display text-2xl font-extrabold tracking-[-0.03em] text-ink sm:text-3xl">Попробуйте ещё один курс</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-ink/52">Первые уроки можно открыть бесплатно и посмотреть, что понравится ребёнку.</p>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {otherCourses.map(([slug, course]) => (
          <Link
            key={slug}
            href={course.href}
            scroll
            className={'group relative isolate min-h-[210px] overflow-hidden rounded-[26px] bg-gradient-to-br ' + course.gradient + ' p-5 text-white shadow-color transition duration-300 hover:-translate-y-1 hover:shadow-luxe sm:p-6'}
          >
            <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-white/20 blur-3xl transition duration-500 group-hover:scale-125" />
            <div className="relative flex h-full flex-col">
              <span className="grid h-12 w-12 place-items-center rounded-[17px] border border-white/20 bg-white/16 text-2xl backdrop-blur-xl">{course.icon}</span>
              <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.17em] text-white/68">{course.kicker}</p>
              <h3 className="mt-1 font-display text-2xl font-extrabold tracking-[-0.035em]">{course.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-5 text-white/72">{course.description}</p>
              <span className="mt-auto pt-5 text-sm font-extrabold">Посмотреть курс <span aria-hidden="true">→</span></span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 flex flex-col justify-between gap-4 rounded-[24px] bg-gradient-to-r from-[#0f1f3d] via-[#1c2f63] to-[#3b1d5e] p-5 text-white sm:flex-row sm:items-center sm:p-6">
        <div>
          <span className="inline-flex rounded-full bg-gradient-to-r from-brand-orange to-brand-pink px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white">
            ★ Пакет «Все направления» · скидка 27%
          </span>
          <h3 className="mt-2 font-display text-xl font-extrabold sm:text-2xl">
            Все 3 курса сразу — за 990 ₽ вместо 1 370 ₽
          </h3>
          <p className="mt-1 text-xs font-semibold text-white/74 sm:text-sm">
            Рисование (30 дней) + ментальная арифметика (30 дней) + подготовка к школе (45 дней) одной оплатой.
          </p>
        </div>
        <Link
          href="/tarify#vse-napravleniya"
          className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-full bg-white px-6 py-2.5 text-xs font-extrabold text-ink shadow-sm transition hover:-translate-y-0.5"
        >
          Открыть пакет за 990 ₽ →
        </Link>
      </div>
    </aside>
  );
}
