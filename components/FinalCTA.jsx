import Link from 'next/link';
import { Icon } from './Icon.jsx';
import { drawingSubscription } from '@/data/drawing-lessons.js';

// Фаза 2: вместо мастера записи «педагог/группы/расписание/ЮKassa» —
// честный блок под новую self-study модель. Ведёт на живой продукт /risovanie
// (freemium: первые уроки бесплатно, полный доступ по подписке).

const startPerks = [
  'Первые уроки в каждой ступени — бесплатно, без карты',
  'Ребёнок рисует на бумаге по шагам с экраном-наставником',
  'Результат оценивает родитель — живая похвала вместо оценок',
  'Занимайтесь когда удобно: без педагогов, групп и расписаний',
];

export function FinalCTA() {
  return (
    <section id="form" className="presentation-slide mesh-bg py-16 sm:py-20 lg:py-24">
      <div className="container-pad">
        <div className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(160deg,rgba(255,255,255,0.82),rgba(241,245,255,0.72))] p-5 shadow-[0_48px_120px_rgba(16,42,86,0.14)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 rounded-[36px] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(255,255,255,0.5)]" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-blue/16 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-brand-pink/14 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-brand-orange/10 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">

            {/* ── LEFT: оффер ── */}
            <div>
              <span className="section-kicker">старт без риска</span>
              <h2 className="section-title mt-5">Начните бесплатно — с правополушарного рисования</h2>
              <p className="mt-5 text-lg font-medium leading-8 text-ink/66">
                Первое живое направление школы уже открыто. Ребёнок занимается сам: смотрит на экран-наставник
                и рисует карандашом на бумаге — красиво выходит с первого раза. Попробуйте бесплатно, а понравится —
                откройте всю мастерскую по подписке.
              </p>

              <ul className="mt-7 grid gap-3">
                {startPerks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3 text-base font-semibold leading-7 text-ink/78">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-blue/12 text-brand-blue">
                      <Icon name="check" className="h-3.5 w-3.5" />
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/risovanie" className="primary-btn">
                  <span className="relative">Начать бесплатно</span>
                  <Icon name="arrow" className="relative h-5 w-5" />
                </Link>
                <Link href="/risovanie#podpiska" className="secondary-btn">
                  Что входит в подписку
                </Link>
              </div>

              <p className="mt-5 text-sm font-medium leading-6 text-ink/48">
                Другие направления — арифметика, скорочтение и другие — откроем следующими.
              </p>
            </div>

            {/* ── RIGHT: карточка подписки ── */}
            <div className="rounded-[28px] border border-white/80 bg-white p-7 shadow-[0_32px_80px_rgba(16,42,86,0.12)] sm:p-9">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/40">Полный доступ</p>
              <p className="mt-3 font-display text-5xl font-extrabold text-ink">
                {drawingSubscription.price} <span className="text-2xl font-bold text-ink/50">₽/{drawingSubscription.period}</span>
              </p>
              <p className="mt-2 text-sm font-semibold text-ink/54">Первые уроки — бесплатно, без карты</p>

              <ul className="mt-6 grid gap-2.5">
                {drawingSubscription.perks.slice(0, 4).map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5 text-sm font-medium leading-6 text-ink/70">
                    <span className="mt-1 grid h-5 w-5 flex-none place-items-center rounded-full bg-brand-green/15 text-xs text-brand-green">✓</span>
                    {perk}
                  </li>
                ))}
              </ul>

              <Link href="/risovanie" className="primary-btn mt-7 w-full justify-center">
                <span className="relative">Открыть уроки</span>
                <Icon name="arrow" className="relative h-5 w-5" />
              </Link>
              <p className="mt-3 text-center text-xs font-medium text-ink/44">
                Отмена в один клик · доступ открывается сразу, на 30 дней
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
