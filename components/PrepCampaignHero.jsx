'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { reachGoal } from '@/lib/metrika';

const paths = [
  {
    href: '/podgotovka-k-shkole#quick-demo',
    eyebrow: 'Основной маршрут',
    title: 'Подготовка к школе',
    text: 'Чтение, речь, логика, внимание и самостоятельность в одном последовательном курсе.',
    icon: 'АБ',
    tone: 'from-[#E8E5FF] via-white to-[#FFE7F1]',
    accent: 'bg-[#7257E8] text-white',
    featured: true,
  },
  {
    href: '/mentalnaya-arifmetika',
    eyebrow: 'Усиливает счёт',
    title: 'Ментальная арифметика',
    text: 'Образ числа, устный счёт, память и концентрация без скучных примеров в тетради.',
    icon: '1+2',
    tone: 'from-[#DFF7FF] via-white to-[#E6F4FF]',
    accent: 'bg-[#2F83ED] text-white',
  },
  {
    href: '/risovanie',
    eyebrow: 'Готовит руку',
    title: 'Правополушарное рисование',
    text: 'Координация, уверенное движение карандаша и привычка доводить работу до результата.',
    icon: '✎',
    tone: 'from-[#FFE5F0] via-white to-[#FFF0D7]',
    accent: 'bg-[#F05A91] text-white',
  },
];

function track(goal, params) {
  reachGoal(goal, { campaign: 'prep-search', ...params });
}

export function PrepCampaignHero() {
  const viewSent = useRef(false);

  useEffect(() => {
    if (viewSent.current) return undefined;
    viewSent.current = true;

    let attempts = 0;
    let timer;
    const send = () => {
      if (typeof window !== 'undefined' && typeof window.ym === 'function') {
        track('prep_landing_view');
        return;
      }
      attempts += 1;
      if (attempts < 10) timer = window.setTimeout(send, 350);
    };
    send();
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section id="top" className="relative isolate overflow-hidden bg-[#F7F4EE] px-5 pb-14 pt-[132px] sm:px-8 sm:pb-20 sm:pt-[150px] lg:px-14 lg:pb-24 lg:pt-[166px]">
      <div className="grain-overlay pointer-events-none absolute inset-0 -z-10" />
      <div className="pointer-events-none absolute -left-40 top-16 -z-10 h-[34rem] w-[34rem] rounded-full bg-brand-blue/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-36 top-0 -z-10 h-[36rem] w-[36rem] rounded-full bg-brand-pink/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-12rem] left-1/2 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-brand-yellow/18 blur-3xl" />

      <div className="container-pad px-0">
        <div className="grid items-center gap-10 lg:grid-cols-[.92fr_1.08fr] lg:gap-12">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-purple/14 bg-white/82 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.16em] text-brand-purple shadow-card backdrop-blur-xl sm:text-xs">
              <span className="h-2 w-2 rounded-full bg-brand-green shadow-[0_0_0_4px_rgba(34,197,94,.12)]" />
              Комплексная подготовка к школе · 5–7 лет
            </span>

            <h1 className="mt-7 max-w-[760px] font-display text-[2.75rem] font-extrabold leading-[.97] tracking-[-0.055em] text-ink sm:text-[4rem] lg:text-[4.85rem]">
              К школе — через игру,
              <span className="mt-2 block bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink bg-clip-text text-transparent">
                а не через уговоры
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base font-semibold leading-7 text-ink/66 sm:text-lg sm:leading-8">
              Основной курс развивает чтение, речь, логику и самостоятельность. Ментальная арифметика усиливает счёт и внимание, а рисование готовит руку к письму.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/podgotovka-k-shkole#quick-demo"
                onClick={() => track('prep_primary_click', { destination: 'quick-demo' })}
                className="primary-btn min-h-[60px] justify-center px-7 text-base"
              >
                Пройти 3 задания бесплатно <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/podgotovka-k-shkole#program"
                onClick={() => track('prep_program_click', { destination: 'program' })}
                className="secondary-btn min-h-[60px] justify-center px-7 text-base"
              >
                Посмотреть программу
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-extrabold text-ink/48">
              <span>● Без регистрации</span>
              <span>● Без карты</span>
              <span>● С голосовыми подсказками</span>
            </div>
          </div>

          <div className="relative animate-rise" style={{ animationDelay: '110ms' }}>
            <div className="pointer-events-none absolute -inset-5 rounded-[48px] bg-gradient-to-br from-brand-blue/22 via-brand-purple/15 to-brand-pink/22 blur-2xl" />
            <div className="relative overflow-hidden rounded-[36px] border-2 border-white/80 bg-white p-3 shadow-luxe sm:rounded-[44px]">
              <div className="relative min-h-[390px] overflow-hidden rounded-[28px] bg-[#17325C] sm:min-h-[500px] sm:rounded-[36px]">
                <img
                  src="/images/school-prep/city-of-knowledge-hero.webp"
                  alt="Игровой Город знаний — маршрут подготовки ребёнка к школе"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07152E]/82 via-transparent to-white/5" />

                <div className="absolute inset-x-4 bottom-4 rounded-[24px] border border-white/18 bg-[#07152E]/82 p-4 text-white shadow-luxe backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#91F0D5] sm:text-[10px]">Результат понятен родителю</p>
                  <p className="mt-2 font-display text-xl font-extrabold leading-tight sm:text-2xl">Ребёнок читает, считает, слышит инструкцию и не боится пробовать</p>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    {[
                      ['АБ', 'чтение'],
                      ['1+2', 'счёт'],
                      ['✎', 'рука'],
                    ].map(([icon, label]) => (
                      <div key={label} className="rounded-[16px] border border-white/12 bg-white/10 px-2 py-3">
                        <strong className="block font-display text-lg text-[#FFE19B]">{icon}</strong>
                        <span className="mt-1 block text-[9px] font-extrabold uppercase tracking-[0.09em] text-white/68">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 lg:mt-16">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-purple">Одна цель — три направления</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.035em] text-ink sm:text-3xl">Начните с основного курса, дополнительные навыки можно усилить отдельно</h2>
            </div>
            <p className="max-w-md text-sm font-semibold leading-6 text-ink/50">Не нужно выбирать всё сразу: бесплатный старт покажет, подходит ли ребёнку формат.</p>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr]">
            {paths.map((path) => (
              <Link
                key={path.href}
                href={path.href}
                onClick={() => track('prep_direction_click', { direction: path.title })}
                className={`group relative overflow-hidden rounded-[26px] border bg-gradient-to-br ${path.tone} p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-color ${path.featured ? 'border-brand-purple/20 ring-2 ring-brand-purple/10' : 'border-white/90'}`}
              >
                <div className="flex items-start gap-4">
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-[17px] font-display text-base font-extrabold shadow-sm ${path.accent}`}>{path.icon}</span>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-[0.16em] text-ink/42">{path.eyebrow}</span>
                    <h3 className="mt-1 font-display text-xl font-extrabold tracking-[-0.025em] text-ink">{path.title}</h3>
                    <p className="mt-2 text-xs font-semibold leading-5 text-ink/54">{path.text}</p>
                  </div>
                </div>
                <span className={`mt-5 inline-flex items-center gap-2 text-xs font-black ${path.featured ? 'text-brand-purple' : 'text-ink/60'}`}>
                  {path.featured ? 'Начать с бесплатных заданий' : 'Посмотреть направление'}
                  <b className="transition group-hover:translate-x-1">→</b>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
