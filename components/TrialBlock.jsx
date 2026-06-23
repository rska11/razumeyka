'use client';

import { Icon } from './Icon.jsx';

export function TrialBlock() {
  return (
    <section className="bg-white px-5 py-8 sm:px-8 lg:px-10">
      <div className="rainbow-band relative mx-auto grid max-w-[1180px] overflow-hidden rounded-[8px] p-7 text-white shadow-color sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-1/2 bg-gradient-to-r from-white/16 to-transparent" />
        <div className="relative">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/72">Пакеты от 400 ₽ до 12900 ₽</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">Выберите пакет и начните обучение</h2>
          <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-white/78">
            Пробный урок, пакет на месяц или два направления. После оплаты мы свяжемся с вами в течение 5–10 минут.
          </p>
        </div>
        <a href="#form" className="relative mt-8 inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full bg-white px-7 py-3.5 font-extrabold text-ink shadow-luxe transition hover:-translate-y-0.5 sm:w-auto lg:mt-0">
          <span className="relative">Выбрать пакет</span>
          <Icon name="arrow" className="relative h-5 w-5" />
        </a>
      </div>
    </section>
  );
}