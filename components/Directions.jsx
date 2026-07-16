'use client';

import Link from 'next/link';
import { Icon } from './Icon.jsx';
import { directionsData } from '../data/directions.js';
import { READY_DIRECTIONS, LAUNCH_LABEL } from '../data/launch.js';
import { WaitlistForm } from './WaitlistForm.jsx';

const directionBySlug = new Map(directionsData.map((direction) => [direction.slug, direction]));

const READY_SLUGS = READY_DIRECTIONS;

const cardOrder = [
  'right-brain-drawing',
  'mental-arithmetic',
  'speed-reading',
  'languages',
  'podgotovka-k-shkole',
  'intuition',
];

const customDirections = {
  'podgotovka-k-shkole': {
    slug: 'podgotovka-k-shkole',
    href: '/podgotovka-k-shkole',
    title: 'Подготовка к школе',
    offer: 'Чтение, счёт, внимание и усидчивость — мягкий вход в первый класс без перегруза.',
    image: '/images/teacher-session.webp',
    icon: 'book',
    metric: 'готовность к школе',
    gradient: 'from-brand-purple via-brand-pink to-brand-orange',
    accentText: 'text-brand-purple',
    chips: ['5–7 лет', 'внимание', 'первый класс'],
  },
};

const directionCopy = {
  'right-brain-drawing': {
    badge: 'уже открыто',
    title: 'Правополушарное рисование',
    text: 'Ребёнок рисует по шагам, подключает вторую руку, развивает образное мышление и видит красивый результат уже на старте.',
    chips: ['3–4', '5–7', '8–10+'],
    gradient: 'from-brand-pink via-brand-purple to-brand-yellow',
    cta: 'Попробовать рисование',
  },
  'mental-arithmetic': {
    badge: 'уже открыто',
    title: 'Ментальная арифметика',
    text: 'Абакус помогает видеть число как образ: ребёнок быстрее считает, удерживает внимание и спокойнее решает примеры.',
    chips: ['счёт', 'память', 'фокус'],
    gradient: 'from-brand-blue via-brand-cyan to-brand-orange',
    cta: 'Попробовать ментальную арифметику',
  },
  'speed-reading': {
    badge: 'следующий запуск',
    title: 'Скорочтение',
    text: 'Тренируем скорость чтения, понимание текста и привычку не теряться перед большим объёмом информации.',
    chips: ['чтение', 'смысл', 'память'],
    gradient: 'from-brand-orange via-brand-yellow to-brand-blue',
  },
  languages: {
    badge: 'следующий запуск',
    title: 'Языки',
    text: 'Один языковой раздел: внутри можно выбрать английский для речи или русский для грамотности.',
    chips: ['английский', 'русский', 'речь'],
    gradient: 'from-brand-green via-brand-cyan to-brand-blue',
    sublinks: [
      { label: 'Английский', href: '/english-for-kids' },
      { label: 'Русский', href: '/russkiy-yazyk-dlya-detey' },
    ],
  },
  intuition: {
    badge: 'следующий запуск',
    title: 'Интуиция',
    text: 'Игры на наблюдательность, детали и спокойную уверенность помогают ребёнку быстрее замечать связи.',
    chips: ['детали', 'решения', 'образность'],
    gradient: 'from-brand-cyan via-brand-green to-brand-blue',
  },
  'podgotovka-k-shkole': {
    badge: 'следующий запуск',
    title: 'Подготовка к школе',
    text: 'Собираем базу перед первым классом: внимание, счёт, чтение, уверенность и привычку заниматься спокойно.',
    chips: ['5–7 лет', 'счёт', 'чтение'],
    gradient: 'from-brand-purple via-brand-pink to-brand-orange',
  },
};

const directionCards = cardOrder
  .map((slug) => {
    const base = directionBySlug.get(slug) ?? customDirections[slug];
    if (!base) return null;
    const copy = directionCopy[slug] ?? {};
    const isReady = READY_SLUGS.has(slug);

    return {
      ...base,
      href: base.href ?? `/${base.slug}`,
      displayTitle: copy.title ?? base.title,
      badge: copy.badge ?? base.metric,
      displayText: copy.text ?? base.offer,
      chips: copy.chips ?? base.chips ?? [],
      gradient: copy.gradient ?? base.gradient,
      cta: copy.cta ?? 'Открыть направление',
      sublinks: copy.sublinks ?? [],
      isReady,
    };
  })
  .filter(Boolean);

export function Directions() {
  return (
    <section id="programs" className="presentation-slide bg-cream">
      <div className="pointer-events-none absolute -left-24 top-12 h-96 w-96 rounded-full bg-brand-blue/18 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-[-8rem] h-96 w-96 rounded-full bg-brand-pink/18 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-yellow/12 blur-3xl" />

      <div className="container-pad relative">
        <div className="mx-auto max-w-4xl text-center">
          <span className="comic-label">все направления</span>
          <h2 className="display-title mx-auto mt-5 max-w-4xl text-[2.35rem] sm:text-5xl lg:text-[3.85rem]">
            Сейчас открыты два курса — остальные запускаем {LAUNCH_LABEL}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold leading-8 text-ink/64">
            Уже можно заниматься в правополушарном рисовании и ментальной арифметике. Скорочтение, языки, подготовка к школе и интуиция появятся следующим запуском.
          </p>
          <div className="mx-auto mt-7 flex max-w-3xl flex-col justify-center gap-3 sm:flex-row">
            <Link href="/mentalnaya-arifmetika" className="primary-btn">
              Попробовать ментальную арифметику
              <Icon name="arrow" className="h-5 w-5" />
            </Link>
            <Link href="/risovanie" className="secondary-btn">
              Попробовать рисование
            </Link>
          </div>
        </div>

        <div className="mt-10 grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
          {directionCards.map((direction, index) => (
            <article
              key={direction.slug}
              className={`group relative flex min-h-[558px] overflow-hidden rounded-[32px] border p-4 shadow-luxe backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:shadow-color ${
                direction.isReady
                  ? 'border-white/80 bg-white/88 hover:bg-white'
                  : 'border-white/72 bg-white/68 hover:bg-white/78'
              }`}
            >
              <div className={`pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br ${direction.gradient} opacity-18 blur-2xl transition duration-500 group-hover:scale-125 group-hover:opacity-28`} />
              <div className="relative flex w-full flex-col">
                <div className="relative h-44 overflow-hidden rounded-[24px] bg-night shadow-card">
                  <img
                    src={direction.image}
                    alt={`${direction.displayTitle}: направление Разумейки`}
                    className={`h-full w-full object-cover transition duration-700 group-hover:scale-[1.05] ${direction.isReady ? '' : 'saturate-[0.82]'}`}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${direction.gradient} opacity-24 mix-blend-multiply`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/62 via-transparent to-white/8" />
                  <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-[18px] bg-white/92 text-ink shadow-luxe backdrop-blur-xl">
                    <Icon name={direction.icon} className="h-6 w-6" />
                  </div>
                  <span className={`absolute bottom-4 left-4 rounded-full border px-3 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.16em] shadow-sm backdrop-blur-xl ${
                    direction.isReady
                      ? 'border-white/30 bg-white/84 text-ink'
                      : 'border-brand-orange/30 bg-brand-orange/92 text-white'
                  }`}>
                    {direction.badge}
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-[1.55rem] font-extrabold leading-tight tracking-[-0.02em] text-ink">
                      {direction.displayTitle}
                    </h3>
                    <span className="shrink-0 font-display text-3xl font-bold text-ink/10">0{index + 1}</span>
                  </div>

                  <p className="mt-4 min-h-[5rem] text-[0.98rem] font-semibold leading-7 text-ink/64">
                    {direction.displayText}
                  </p>

                  <div className="mt-5 flex min-h-[2rem] flex-wrap gap-2">
                    {direction.chips.map((chip) => (
                      <span key={chip} className="rounded-full border border-ink/8 bg-ink/5 px-3 py-1.5 text-xs font-extrabold text-ink/62">
                        {chip}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 grid min-h-[2.25rem] grid-cols-2 gap-2">
                    {direction.sublinks.length > 0
                      ? direction.sublinks.map((link) => (
                          <span
                            key={link.href}
                            className="rounded-full border border-ink/8 bg-white/60 px-3 py-2 text-center text-xs font-extrabold text-ink/46"
                          >
                            {link.label}
                          </span>
                        ))
                      : <span className="invisible col-span-2 rounded-full px-3 py-2 text-xs">подразделы</span>}
                  </div>

                  {direction.isReady ? (
                    <Link
                      href={direction.href}
                      className={`mt-auto inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-gradient-to-r ${direction.gradient} px-5 py-3 text-sm font-extrabold text-white shadow-color transition hover:-translate-y-0.5`}
                    >
                      {direction.cta}
                      <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                  ) : (
                    <div className="mt-auto rounded-[24px] border border-brand-orange/20 bg-gradient-to-br from-brand-orange/12 via-white/78 to-brand-yellow/16 p-4 shadow-card">
                      <WaitlistForm direction={direction.slug} source="card" compact />
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}