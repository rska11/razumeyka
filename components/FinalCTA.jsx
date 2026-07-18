import Link from 'next/link';
import { Icon } from './Icon.jsx';

const startPerks = [
  'Сейчас открыты 3 направления: рисование, ментальная арифметика и подготовка к школе',
  'Первые уроки можно попробовать бесплатно, без карты',
  'Ребёнок занимается самостоятельно — по понятным шагам и в удобное время',
  'Доступ открывается на 30 дней без автоматического продления',
];

const readyDirections = [
  {
    title: 'Ментальная арифметика',
    shortTitle: 'Попробовать ментальную арифметику',
    text: 'Счёт, внимание, память и уверенность в примерах.',
    href: '/mentalnaya-arifmetika',
    icon: 'abacus',
    gradient: 'from-[#079A78] via-[#16A6A1] to-[#3B82F6]',
  },
  {
    title: 'Правополушарное рисование',
    shortTitle: 'Попробовать рисование',
    text: 'Творчество, образное мышление и красивый результат.',
    href: '/risovanie',
    icon: 'palette',
    gradient: 'from-[#7257E8] via-[#A855F7] to-[#EC4899]',
  },
  {
    title: 'Подготовка к школе',
    shortTitle: 'Попробовать подготовку к школе',
    text: 'Речь, счёт, логика, внимание и самостоятельность.',
    href: '/podgotovka-k-shkole',
    icon: 'book',
    gradient: 'from-[#246BFD] via-[#7257E8] to-[#F05A87]',
  },
];

export function FinalCTA() {
  return (
    <section id="form" className="presentation-slide mesh-bg py-16 sm:py-20 lg:py-24">
      <div className="container-pad">
        <div className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.9),rgba(239,246,255,0.8),rgba(253,242,248,0.78))] p-5 shadow-[0_48px_120px_rgba(16,42,86,0.14)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 rounded-[36px] shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-blue/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 top-4 h-72 w-72 rounded-full bg-brand-pink/18 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-56 w-[32rem] -translate-x-1/2 rounded-full bg-brand-green/14 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div>
              <span className="section-kicker">старт без риска</span>
              <h2 className="section-title mt-5">Начните с одного из трёх открытых направлений</h2>
              <p className="mt-5 text-lg font-medium leading-8 text-ink/66">
                Рисование, ментальная арифметика и подготовка к школе уже готовы к занятиям.
                Выберите курс под цель ребёнка и попробуйте первые уроки бесплатно.
              </p>

              <ul className="mt-7 grid gap-3">
                {startPerks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3 text-base font-semibold leading-7 text-ink/78">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green/14 text-brand-green">
                      <Icon name="check" className="h-3.5 w-3.5" />
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {readyDirections.map((direction) => (
                  <Link
                    key={direction.href}
                    href={direction.href}
                    className={'group inline-flex min-h-[58px] items-center justify-between gap-3 rounded-[20px] bg-gradient-to-r ' + direction.gradient + ' px-5 py-3.5 text-sm font-extrabold text-white shadow-color transition hover:-translate-y-1 hover:shadow-luxe'}
                  >
                    <span>{direction.shortTitle}</span>
                    <Icon name="arrow" className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/85 bg-white/82 p-5 shadow-[0_32px_80px_rgba(16,42,86,0.12)] backdrop-blur-xl sm:p-7">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-purple">Открытые уроки</p>
              <p className="mt-3 font-display text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink">
                3 <span className="text-2xl font-bold text-ink/50">направления</span>
              </p>
              <p className="mt-2 text-sm font-semibold text-ink/54">Можно начать сегодня: первые уроки доступны бесплатно</p>

              <div className="mt-6 grid gap-3">
                {readyDirections.map((direction) => (
                  <Link
                    key={direction.href}
                    href={direction.href}
                    className={'group relative isolate flex items-start gap-3 overflow-hidden rounded-[22px] bg-gradient-to-br ' + direction.gradient + ' p-4 text-white shadow-color transition hover:-translate-y-1 hover:shadow-luxe'}
                  >
                    <span className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/22 blur-2xl transition group-hover:scale-125" />
                    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] border border-white/20 bg-white/16 backdrop-blur-xl">
                      <Icon name={direction.icon} className="h-5 w-5" />
                    </span>
                    <span className="relative">
                      <span className="block font-display text-base font-extrabold leading-tight">{direction.title}</span>
                      <span className="mt-1 block text-sm font-semibold leading-5 text-white/76">{direction.text}</span>
                    </span>
                  </Link>
                ))}
              </div>

              <Link href="/#programs" className="mt-6 inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink px-6 py-3 text-sm font-extrabold text-white shadow-color transition hover:-translate-y-1 hover:shadow-luxe">
                Посмотреть все направления
                <Icon name="arrow" className="h-5 w-5" />
              </Link>
              <p className="mt-3 text-center text-xs font-medium text-ink/44">
                Остальные направления готовим к запуску
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
