'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon.jsx';

const problems = [
  {
    icon: 'focus',
    title: 'Садится за уроки — сразу отвлекается',
    text: 'Только открыли тетрадь, а внимание уже ушло в окно, игрушки или телефон.',
    image: '/images/course-intuition.webp',
    accent: 'from-brand-blue to-brand-cyan',
    bg: 'from-brand-blue/14 via-white to-brand-cyan/10',
    line: 'bg-brand-blue',
  },
  {
    icon: 'book',
    title: 'Читает, но не понимает смысл',
    text: 'Слова вроде прочитал, но пересказать не может — и снова начинается раздражение.',
    image: '/images/course-reading.webp',
    accent: 'from-brand-orange to-brand-yellow',
    bg: 'from-brand-orange/14 via-white to-brand-yellow/12',
    line: 'bg-brand-orange',
  },
  {
    icon: 'confidence',
    title: 'Боится отвечать, даже если знает',
    text: 'Дома все получается, а на уроке теряется, молчит и боится ошибиться.',
    image: '/images/course-acting.webp',
    accent: 'from-brand-pink to-brand-purple',
    bg: 'from-brand-pink/14 via-white to-brand-purple/10',
    line: 'bg-brand-pink',
  },
  {
    icon: 'logic',
    title: 'Теряется в простых задачах',
    text: 'Понимает по отдельности, но не видит шаги решения и быстро сдается.',
    image: '/images/course-arithmetic.webp',
    accent: 'from-brand-green to-brand-blue',
    bg: 'from-brand-green/14 via-white to-brand-blue/10',
    line: 'bg-brand-green',
  },
];

export function PainPoints() {
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
    <section ref={sectionRef} className="presentation-slide bg-cream">
      <div className="pointer-events-none absolute left-0 top-10 h-72 w-72 rounded-full bg-brand-red/14 blur-3xl" />
      <div className="pointer-events-none absolute right-10 bottom-10 h-72 w-72 rounded-full bg-brand-blue/14 blur-3xl" />

      <div className="container-pad relative">
        <div className="grid gap-7 lg:grid-cols-[0.76fr_1fr] lg:items-end">
          <div
            className={`transition duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <span className="comic-label">Знакомо?</span>
            <h2 className="section-title mt-5">Вы это уже замечали у ребенка?</h2>
          </div>
          <p
            className={`text-lg font-medium leading-8 text-ink/62 transition duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            Родители часто видят не “лень”, а усталость от задач, которые пока слишком сложно удержать в голове. Мы начинаем именно с этих узнаваемых ситуаций.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {problems.map((item, index) => (
            <article
              key={item.title}
              className={`group relative min-h-[360px] overflow-hidden rounded-[8px] border-2 border-white bg-gradient-to-br ${item.bg} p-4 shadow-card transition duration-500 hover:-translate-y-2 hover:scale-[1.015] hover:shadow-color ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 130}ms` }}
            >
              <div className={`absolute -right-14 -top-14 h-36 w-36 rounded-full bg-gradient-to-br ${item.accent} opacity-18 blur-2xl transition group-hover:scale-125 group-hover:opacity-28`} />

              <div className="relative h-32 overflow-hidden rounded-[8px] bg-white shadow-sm">
                <img
                  src={item.image}
                  alt={`${item.title}: ситуация, знакомая родителям`}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night/24 via-transparent to-white/8" />
              </div>

              <div className="relative mt-5 flex items-center justify-between">
                <div className={`flex h-[52px] w-[52px] items-center justify-center rounded-[8px] bg-gradient-to-br ${item.accent} text-white shadow-color`}>
                  <Icon name={item.icon} className="h-7 w-7" />
                </div>
                <span className="rounded-full bg-white/72 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-ink/46">
                  ситуация 0{index + 1}
                </span>
              </div>

              <h3 className="relative mt-7 font-display text-[1.35rem] font-black leading-[1.12] text-ink">{item.title}</h3>
              <p className="relative mt-4 text-sm font-semibold leading-7 text-ink/60">{item.text}</p>

              <div className="relative mt-7 h-2 overflow-hidden rounded-full bg-ink/8">
                <div className={`h-full w-1/3 rounded-full ${item.line} transition-all duration-500 group-hover:w-full`} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}