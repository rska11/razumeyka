'use client';

import { Icon } from './Icon.jsx';

const MONTH_NAMES = [
  'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
  'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь',
];

export function Scarcity() {
  const currentMonth = MONTH_NAMES[new Date().getMonth()];

  return (
    <section className="bg-white px-5 py-8 sm:px-8 lg:px-10">
      <div className="rainbow-band relative mx-auto grid max-w-[1180px] overflow-hidden rounded-[8px] p-7 text-white shadow-color sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/72">Места ограничены</p>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">В наборе на {currentMonth} осталось 9 пробных уроков</h2>
          <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-white/78">
            Мы не набираем больше детей, чем преподаватели могут сопровождать качественно.
          </p>
        </div>
        <a href="#form" className="relative mt-8 inline-flex min-h-[54px] items-center justify-center gap-3 rounded-full bg-white px-7 py-3.5 font-extrabold text-ink shadow-luxe transition hover:-translate-y-0.5 lg:mt-0">
          Забронировать место
          <Icon name="arrow" className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
}