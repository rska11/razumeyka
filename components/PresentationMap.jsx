'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon.jsx';

const steps = [
  {
    icon: 'screen',
    title: 'Онлайн урок',
    text: 'Ребенок подключается из дома и быстро понимает формат занятия.',
    image: '/images/hero-learning.webp',
    accent: 'from-brand-blue to-brand-cyan',
    glow: 'bg-brand-blue/28',
    offset: 'md:translate-y-0',
  },
  {
    icon: 'gamepad',
    title: 'Вовлечение',
    text: 'Игровые элементы помогают легче включиться, но не заменяют обучение.',
    image: '/images/course-drawing.webp',
    accent: 'from-brand-orange to-brand-yellow',
    glow: 'bg-brand-orange/28',
    offset: 'md:translate-y-8',
  },
  {
    icon: 'book',
    title: 'Навык',
    text: 'Упражнения переводят интерес в конкретный результат: чтение, счет, речь.',
    image: '/images/course-reading.webp',
    accent: 'from-brand-pink to-brand-purple',
    glow: 'bg-brand-pink/26',
    offset: 'md:translate-y-0',
  },
  {
    icon: 'confidence',
    title: 'Уверенность',
    text: 'Ребенок переносит новый навык в школу, общение и домашние задания.',
    image: '/images/before-after-progress.webp',
    accent: 'from-brand-green to-brand-blue',
    glow: 'bg-brand-green/26',
    offset: 'md:translate-y-8',
  },
];

export function PresentationMap() {
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
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="presentation-slide rainbow-band text-white">
      <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-white/18 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-brand-yellow/24 blur-3xl" />

      <div className="container-pad relative">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div
            className={`transition duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <span className="inline-flex rounded-full border border-white/24 bg-white/16 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-white shadow-sm backdrop-blur-xl">
              путь развития
            </span>
            <h2 className="mt-5 font-display text-[2.35rem] font-bold leading-[1.03] tracking-[-0.03em] sm:text-5xl lg:text-[4rem]">
              От “не хочу” до “у меня получилось”
            </h2>
            <p className="mt-5 max-w-xl text-lg font-semibold leading-8 text-white/78">
              Мы выстраиваем понятный путь развития ребенка: от вовлечения к навыку и уверенности. Игровые элементы используются как инструмент, чтобы ребенку было легче включиться в процесс.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className={`group relative min-h-[330px] overflow-hidden rounded-[24px] border border-white/32 bg-white/18 p-4 shadow-luxe backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:scale-[1.015] ${step.offset} ${
                  isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 130}ms` }}
              >
                <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full ${step.glow} blur-2xl transition group-hover:scale-125`} />

                <div className="relative h-28 overflow-hidden rounded-[18px] border border-white/30 bg-white/20">
                  <img
                    src={step.image}
                    loading="lazy"
                    decoding="async"
                    alt={`${step.title}: этап развития ребенка`}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.08]"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${step.accent} opacity-20 mix-blend-multiply`} />
                </div>

                <div className="relative mt-5 flex items-center justify-between">
                  <div className={`flex h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-gradient-to-br ${step.accent} text-white shadow-luxe`}>
                    <Icon name={step.icon} className="h-7 w-7" />
                  </div>
                  <span className="font-display text-5xl font-black text-white/26">0{index + 1}</span>
                </div>

                <p className="relative mt-6 font-display text-[1.35rem] font-black leading-tight">{step.title}</p>
                <p className="relative mt-3 text-sm font-semibold leading-6 text-white/76">{step.text}</p>

                <div className={`relative mt-6 h-2 rounded-full bg-gradient-to-r ${step.accent} shadow-luxe`} />

                {index < steps.length - 1 && (
                  <span className="absolute -right-7 top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 animate-floaty items-center justify-center rounded-full border border-white/30 bg-night/86 text-white shadow-luxe backdrop-blur-xl md:flex">
                    <Icon name="arrow" className="h-6 w-6" />
                  </span>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}