'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from './Icon.jsx';
import { directionsData } from '../data/directions.js';

const programCards = directionsData;
const moreDirections = [
  { title: 'Подготовка к школе', slug: 'podgotovka-k-shkole', emoji: '🎒', blurb: 'Чтение, счёт, внимание и усидчивость к первому классу' },
  { title: 'Актёрское мастерство', slug: 'akterskoe-masterstvo', emoji: '🎭', blurb: 'Раскрепощение, речь и уверенность на публике' },
  { title: 'Английский для детей', slug: 'english-for-kids', emoji: '🇬🇧', blurb: 'Живая речь без зубрёжки, в мини-группах' },
  { title: 'Русский язык для детей', slug: 'russkiy-yazyk-dlya-detey', emoji: '✏️', blurb: 'Грамотность через понимание, а не зубрёжку' },
];
const SLIDE_INTERVAL = 3000;

export function Directions() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const active = programCards[activeIndex];

  useEffect(() => {
    if (isPaused) {
      return undefined;
    }

    const timer = setInterval(() => {
      setActiveIndex((index) => (index + 1) % programCards.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused]);

  function goNext() {
    setActiveIndex((index) => (index + 1) % programCards.length);
  }

  function goPrev() {
    setActiveIndex((index) => (index - 1 + programCards.length) % programCards.length);
  }

  return (
    <section id="programs" className="presentation-slide bg-cream">
      <div className="pointer-events-none absolute -left-24 top-20 h-96 w-96 rounded-full bg-brand-blue/18 blur-3xl" />
      <div className="pointer-events-none absolute bottom-16 right-[-8rem] h-96 w-96 rounded-full bg-brand-pink/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-yellow/14 blur-3xl" />

      <div className="container-pad relative">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <span className="comic-label">направления</span>
            <h2 className="display-title mt-6 max-w-5xl text-[2.6rem] sm:text-6xl lg:text-[5rem]">
              Выбирайте не курс, а суперсилу ребенка
            </h2>
          </div>
          <div className="rounded-[8px] border-2 border-ink bg-white p-5 shadow-[10px_10px_0_rgba(59,130,246,0.18)]">
            <p className="text-lg font-bold leading-8 text-ink/70">
              Направления переключаются автоматически каждые 3 секунды. Наведите курсор на слайдер, чтобы остановить автопрокрутку.
            </p>
          </div>
        </div>

        <div
          className={`mt-12 grid gap-6 rounded-[8px] bg-gradient-to-br ${active.bg} p-4 shadow-color transition-colors duration-700 lg:grid-cols-[0.92fr_1.08fr] lg:p-6`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <div className="relative min-h-[500px] overflow-hidden rounded-[8px] bg-night shadow-luxe">
            <img
              key={active.image}
              src={active.image}
              alt={`${active.title}: онлайн-занятие для развития ребенка`}
              className="h-[500px] w-full animate-slideFade object-cover transition duration-700 hover:scale-[1.04] lg:h-full"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${active.gradient} opacity-30 mix-blend-multiply transition-opacity duration-700`} />
            <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
            <div className="absolute left-5 top-5 flex h-16 w-16 items-center justify-center rounded-[8px] bg-white text-ink shadow-luxe">
              <Icon name={active.icon} className="h-8 w-8" />
            </div>
            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
              {active.chips.map((point) => (
                <span key={point} className="floating-chip animate-softPop">
                  {point}
                </span>
              ))}
            </div>
          </div>

          <div className="relative flex min-h-[500px] flex-col overflow-hidden rounded-[8px] border-2 border-ink bg-white p-6 shadow-[12px_12px_0_rgba(19,35,27,0.14)] sm:p-8 lg:p-10">
            <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br ${active.gradient} opacity-25 blur-2xl transition duration-700`} />
            <div className="relative flex items-center justify-between gap-4">
              <span className={`rounded-full bg-gradient-to-r ${active.gradient} px-4 py-2 text-sm font-extrabold uppercase tracking-[0.16em] text-white shadow-color`}>
                {active.metric}
              </span>
              <span className="font-display text-5xl font-bold text-ink/10">0{activeIndex + 1}</span>
            </div>

            <div key={active.title} className="relative my-auto animate-slideFade py-10">
              <h3 className="font-display text-[2.3rem] font-bold leading-[1.02] tracking-[-0.03em] text-ink sm:text-5xl lg:text-[4.2rem]">
                {active.title}
              </h3>
              <p className="mt-7 max-w-xl text-xl font-semibold leading-9 text-ink/66">{active.offer}</p>
            </div>

            <div className="relative mt-auto flex flex-col gap-5 border-t-2 border-ink pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2" aria-label="Индикаторы слайдера">
                  {programCards.map((item, index) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        index === activeIndex ? 'w-12 bg-ink' : 'w-3 bg-ink/18 hover:bg-ink/38'
                      }`}
                      aria-label={`Показать ${item.title}`}
                      aria-current={index === activeIndex}
                    />
                  ))}
                </div>
                <Link href={`/${active.slug}`} className="secondary-btn min-h-[54px] px-6 py-3">
                  Подробнее о направлении
                </Link>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={goPrev}
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-white text-ink shadow-[4px_4px_0_rgba(19,35,27,0.14)] transition hover:-translate-y-0.5 hover:bg-cream"
                  aria-label="Предыдущее направление"
                >
                  <Icon name="arrow" className="h-5 w-5 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-ink text-white shadow-[4px_4px_0_rgba(19,35,27,0.14)] transition hover:-translate-y-0.5 hover:bg-night"
                  aria-label="Следующее направление"
                >
                  <Icon name="arrow" className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-5">
          {programCards.map((item, index) => (
            <div
              key={item.title}
              className={`rounded-[8px] border-2 p-4 transition duration-300 ${
                index === activeIndex
                  ? 'border-ink bg-ink text-white shadow-[8px_8px_0_rgba(19,35,27,0.14)]'
                  : 'border-white/70 bg-white/72 text-ink shadow-card backdrop-blur-xl'
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className="w-full text-left"
                aria-current={index === activeIndex}
              >
                <Icon name={item.icon} className="h-6 w-6" />
                <span className="mt-3 block text-sm font-extrabold leading-5">{item.title}</span>
              </button>
              <Link
                href={`/${item.slug}`}
                className={`mt-4 inline-flex items-center gap-2 text-sm font-extrabold ${
                  index === activeIndex ? 'text-white/88' : item.accentText
                }`}
              >
                Подробнее
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h3 className="text-center font-display text-2xl font-extrabold text-ink sm:text-3xl">Ещё направления</h3>
          <div className="mx-auto mt-6 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {moreDirections.map((d) => (
              <Link
                key={d.slug}
                href={`/${d.slug}`}
                className="group rounded-[8px] border-2 border-ink bg-white p-5 shadow-[6px_6px_0_rgba(19,35,27,0.12)] transition hover:-translate-y-1"
              >
                <span className="text-4xl">{d.emoji}</span>
                <span className="mt-3 block font-display text-lg font-extrabold leading-tight text-ink">{d.title}</span>
                <span className="mt-1 block text-sm font-semibold leading-6 text-ink/60">{d.blurb}</span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-extrabold text-brand-blue">
                  Подробнее <Icon name="arrow" className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}