'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon.jsx';

const rows = [
  {
    beforeLabel: 'Было',
    before: 'Долго делает домашку',
    afterLabel: 'После',
    after: 'Быстрее читает условие и спокойнее начинает задачу',
    color: 'from-brand-blue to-brand-cyan',
    icon: 'book',
    note: 'минус стресс',
  },
  {
    beforeLabel: 'Было',
    before: 'Стесняется выступать',
    afterLabel: 'После',
    after: 'Увереннее говорит, отвечает и держит внимание аудитории',
    color: 'from-brand-pink to-brand-purple',
    icon: 'theater',
    note: 'голос + подача',
    photo: '/images/course-acting.webp',
  },
  {
    beforeLabel: 'Было',
    before: 'Считает только на пальцах',
    afterLabel: 'После',
    after: 'Понимает логику счета и быстрее решает примеры',
    color: 'from-brand-green to-brand-blue',
    icon: 'abacus',
    note: 'скорость счета',
    infographic: ['память', 'логика', 'фокус'],
  },
];

export function BeforeAfter() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="presentation-slide bg-white">
      <div className="pointer-events-none absolute left-[-8rem] top-20 h-96 w-96 rounded-full bg-brand-yellow/18 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-[-6rem] h-96 w-96 rounded-full bg-brand-cyan/16 blur-3xl" />

      <div className="container-pad relative">
        <div
          className={`grid gap-10 transition duration-700 lg:grid-cols-[0.88fr_1.12fr] lg:items-center ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div>
            <span className="comic-label">До / После</span>
            <h2 className="section-title mt-5">
              Родители покупают не курс, а перемены в ребенке
            </h2>
            <p className="mt-6 text-lg font-medium leading-8 text-ink/62">
              Мы связываем упражнения с реальными ситуациями: домашка, чтение, ответы у доски и общение. Поэтому прогресс видно не только на уроке, но и дома.
            </p>

            <div className="relative mt-8 overflow-hidden rounded-[8px] border-2 border-white bg-cream p-3 shadow-color">
              <img
                src="/images/before-after-progress.webp"
                loading="lazy"
                decoding="async"
                alt="Ребенок из Восточной Европы занимается онлайн и радуется прогрессу"
                className={`h-[360px] w-full rounded-[8px] object-cover object-[52%_45%] transition duration-1000 ${
                  isVisible ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'
                }`}
              />
              <div className="pointer-events-none absolute inset-3 rounded-[8px] bg-gradient-to-t from-night/28 via-transparent to-white/10" />
              <div className="absolute bottom-6 left-6 rounded-[8px] border border-white/60 bg-white/82 px-5 py-4 shadow-luxe backdrop-blur-xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-blue">видимый результат</p>
                <p className="mt-2 font-display text-3xl font-black text-ink">+ уверенность</p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {rows.map((row, index) => (
              <article
                key={row.before}
                className={`group grid gap-3 rounded-[8px] border-2 border-white bg-cream p-3 shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-color sm:grid-cols-[1fr_auto_1.12fr] sm:items-stretch ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <div className="relative overflow-hidden rounded-[8px] border border-brand-red/18 bg-white p-5">
                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-brand-red/10 blur-2xl" />
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-red">{row.beforeLabel}</p>
                  <p className="relative mt-3 font-bold leading-6 text-ink/66">{row.before}</p>
                </div>

                <div className="flex items-center justify-center">
                  <div className="flex h-14 w-14 animate-pulse items-center justify-center rounded-full border border-ink/10 bg-white text-brand-purple shadow-card">
                    <Icon name="arrow" className="h-7 w-7" />
                  </div>
                </div>

                <div className={`relative overflow-hidden rounded-[8px] bg-gradient-to-br ${row.color} p-5 text-white shadow-luxe transition duration-500 group-hover:scale-[1.015]`}>
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/18 blur-2xl" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/72">{row.afterLabel}</p>
                      <p className="mt-3 font-bold leading-6">{row.after}</p>
                    </div>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-white/18 text-white backdrop-blur">
                      <Icon name={row.icon} className="h-6 w-6" />
                    </span>
                  </div>

                  <div className="relative mt-5 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/18 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] text-white">
                      {row.note}
                    </span>
                    {row.photo && (
                      <img
                        src={row.photo}
                        loading="lazy"
                        decoding="async"
                        alt="Ребенок практикует уверенную речь"
                        className="h-12 w-16 rounded-[8px] border border-white/40 object-cover shadow-card"
                      />
                    )}
                    {row.infographic?.map((item, itemIndex) => (
                      <span key={item} className="flex items-center gap-2 rounded-full bg-white/18 px-3 py-1.5 text-xs font-extrabold text-white">
                        <span className="h-2 rounded-full bg-white" style={{ width: `${18 + itemIndex * 10}px` }} />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}