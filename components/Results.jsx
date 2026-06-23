'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon.jsx';

const resultCards = [
  {
    program: 'Ментальная арифметика',
    headline: 'Считает в уме быстрее, чем на калькуляторе',
    text: 'Ребенок начинает видеть логику счета и быстрее решает примеры.',
    icon: 'abacus',
    gradient: 'from-brand-blue to-brand-cyan',
    bg: 'from-brand-blue/14 via-white to-brand-cyan/10',
  },
  {
    program: 'Скорочтение',
    headline: 'Читает быстрее и начинает понимать смысл',
    text: 'Текст перестает быть нагрузкой: появляется скорость и уверенность.',
    icon: 'book',
    gradient: 'from-brand-orange to-brand-yellow',
    bg: 'from-brand-orange/14 via-white to-brand-yellow/12',
  },
  {
    program: 'Правополушарное рисование',
    headline: 'Перестает бояться ошибок и начинает творить',
    text: 'Ребенок смелее пробует, фантазирует и спокойно относится к “неидеально”.',
    icon: 'palette',
    gradient: 'from-brand-pink to-brand-purple',
    bg: 'from-brand-pink/14 via-white to-brand-purple/10',
  },
  {
    program: 'Интуиция',
    headline: 'Быстрее принимает решения и чувствует ответ',
    text: 'Тренирует наблюдательность, внимание и внутреннюю уверенность.',
    icon: 'spark',
    gradient: 'from-brand-cyan to-brand-green',
    bg: 'from-brand-cyan/14 via-white to-brand-green/10',
  },
  {
    program: 'Языки',
    headline: 'Начинает говорить, а не просто учить слова',
    text: 'Слова превращаются в живую речь, фразы и смелость общаться.',
    icon: 'theater',
    gradient: 'from-brand-purple to-brand-blue',
    bg: 'from-brand-purple/14 via-white to-brand-blue/10',
  },
];

export function Results() {
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
    <section ref={sectionRef} id="results" className="presentation-slide bg-porcelain">
      <div className="pointer-events-none absolute left-0 top-10 h-72 w-72 rounded-full bg-brand-cyan/24 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-10 h-72 w-72 rounded-full bg-brand-pink/18 blur-3xl" />

      <div className="container-pad relative">
        <div className="grid gap-10 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
          <div
            className={`transition duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <span className="comic-label">Результаты ребенка</span>
            <h2 className="section-title mt-5">Вот что реально меняется у ребенка</h2>
            <p className="mt-6 text-lg font-medium leading-8 text-ink/62">
              Мы показываем прогресс не абстрактными словами, а через изменения, которые родитель замечает дома: в чтении, счете, речи, творчестве и уверенности.
            </p>

            <div className="mt-8 rounded-[8px] bg-gradient-to-br from-brand-blue via-brand-purple to-brand-pink p-6 text-white shadow-color">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/72">сильнее, чем просто занятия</p>
              <p className="mt-3 text-lg font-bold leading-7">
                Вы не просто отдаете ребенка на занятия — вы видите результат.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {resultCards.map((card, index) => (
              <article
                key={card.program}
                className={`group relative min-h-[270px] overflow-hidden rounded-[8px] border-2 border-white bg-gradient-to-br ${card.bg} p-6 shadow-card transition duration-500 hover:-translate-y-2 hover:scale-[1.012] hover:shadow-color ${
                  index === 4 ? 'sm:col-span-2 sm:min-h-[230px]' : ''
                } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${card.gradient} opacity-18 blur-2xl transition group-hover:scale-125 group-hover:opacity-30`} />
                <div className="relative flex items-start justify-between gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-[8px] bg-gradient-to-br ${card.gradient} text-white shadow-color`}>
                    <Icon name={card.icon} className="h-7 w-7" />
                  </div>
                  <span className="rounded-full bg-white/72 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-ink/46">
                    {card.program}
                  </span>
                </div>

                <h3 className="relative mt-8 max-w-xl font-display text-2xl font-black leading-tight text-ink">
                  {card.headline}
                </h3>
                <p className="relative mt-4 max-w-xl text-sm font-semibold leading-7 text-ink/60">{card.text}</p>

                <div className="relative mt-7 h-2 overflow-hidden rounded-full bg-ink/8">
                  <div className={`h-full w-1/3 rounded-full bg-gradient-to-r ${card.gradient} transition-all duration-500 group-hover:w-full`} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}