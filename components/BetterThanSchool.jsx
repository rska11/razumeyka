'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon.jsx';

const methodCards = [
  {
    title: 'Понятная система',
    text: 'У ребенка есть маршрут: от диагностики к упражнениям, закреплению и результату.',
    icon: 'logic',
    number: '01',
    accent: 'from-brand-blue to-brand-cyan',
    glow: 'bg-brand-blue/20',
    line: 'bg-brand-blue',
  },
  {
    title: 'Контроль прогресса',
    text: 'Родитель видит изменения: внимание, скорость, уверенность и самостоятельность.',
    icon: 'focus',
    number: '02',
    accent: 'from-brand-orange to-brand-yellow',
    glow: 'bg-brand-orange/20',
    line: 'bg-brand-orange',
  },
  {
    title: 'Фокус на результате',
    text: 'Мы ведем не к “занятию ради занятия”, а к конкретному навыку ребенка.',
    icon: 'check',
    number: '03',
    accent: 'from-brand-pink to-brand-purple',
    glow: 'bg-brand-pink/20',
    line: 'bg-brand-pink',
  },
  {
    title: 'Свой темп',
    text: 'Ребёнок идёт в своём ритме: экран-наставник показывает каждый шаг, без спешки и оценок.',
    icon: 'confidence',
    number: '04',
    accent: 'from-brand-green to-brand-blue',
    glow: 'bg-brand-green/20',
    line: 'bg-brand-green',
  },
];

export function BetterThanSchool() {
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
      { threshold: 0.22 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="presentation-slide bg-white text-ink">
      <div className="pointer-events-none absolute -left-24 top-16 h-96 w-96 rounded-full bg-brand-blue/12 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8rem] top-24 h-96 w-96 rounded-full bg-brand-pink/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-yellow/14 blur-3xl" />

      <div className="container-pad relative">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div
            className={`transition duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <span className="comic-label">методика</span>
            <h2 className="section-title mt-5">Результат — это не случайность</h2>
          </div>
          <div
            className={`rounded-[28px] border border-white/80 bg-white/84 p-6 shadow-luxe backdrop-blur-xl transition duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <p className="text-lg font-bold leading-8 text-ink/68">
              У ребенка получается не потому, что “было интересно один раз”, а потому что есть система: маршрут, контроль прогресса, фокус на навыке и понятные шаги, которые ведут ребёнка к результату в своём темпе.
            </p>
          </div>
        </div>

        <div className="relative mt-10">
          <div className="absolute left-8 right-8 top-1/2 hidden h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-brand-blue via-brand-orange via-brand-pink to-brand-green lg:block" />

          <div className="grid gap-6 lg:grid-cols-4">
            {methodCards.map((card, index) => (
              <article
                key={card.title}
                className={`group relative min-h-[310px] overflow-hidden rounded-[24px] border border-white/85 bg-white/86 p-6 shadow-card backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:scale-[1.012] hover:shadow-color ${
                  index % 2 ? 'lg:translate-y-6' : 'lg:translate-y-0'
                } ${isVisible ? 'opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ transitionDelay: `${index * 130}ms` }}
              >
                <div className={`absolute -right-14 -top-14 h-36 w-36 rounded-full ${card.glow} blur-2xl transition group-hover:scale-125`} />
                <div className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${card.accent}`} />

                <div className="relative flex items-start justify-between gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-[18px] bg-gradient-to-br ${card.accent} text-white shadow-luxe`}>
                    <Icon name={card.icon} className="h-7 w-7" />
                  </div>
                  <span className="font-display text-5xl font-black text-ink/10">{card.number}</span>
                </div>

                <h3 className="relative mt-8 font-display text-2xl font-black leading-tight text-ink">{card.title}</h3>
                <p className="relative mt-4 text-sm font-semibold leading-7 text-ink/60">{card.text}</p>

                <div className="relative mt-8 flex items-center gap-3">
                  <span className={`h-3 w-3 rounded-full ${card.line}`} />
                  <span className={`h-1 flex-1 rounded-full ${card.line} opacity-40`} />
                </div>

                {index < methodCards.length - 1 && (
                  <div className="absolute -right-7 top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 animate-floaty items-center justify-center rounded-full border border-ink/10 bg-white text-ink shadow-card lg:flex">
                    <Icon name="arrow" className="h-6 w-6" />
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        <div
          className={`mt-10 grid gap-4 rounded-[28px] border border-white/10 bg-night p-5 text-white shadow-luxe transition duration-700 lg:grid-cols-[auto_1fr_auto] lg:items-center ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-white text-ink">
            <Icon name="check" className="h-7 w-7" />
          </div>
          <p className="text-lg font-bold leading-8 text-white/78">
            Игровые элементы остаются инструментом вовлечения. Основа результата — методика, последовательность и понятные шаги в своём темпе.
          </p>
          <a href="/risovanie" className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-5 text-sm font-extrabold text-ink transition hover:-translate-y-1">
            Начать бесплатно
          </a>
        </div>
      </div>
    </section>
  );
}