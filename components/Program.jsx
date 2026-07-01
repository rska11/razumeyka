'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon.jsx';

const steps = [
  {
    number: '01',
    title: 'Диагностика',
    text: 'Определяем возрастной уровень, внимание, скорость чтения и уверенность ребенка.',
    icon: 'focus',
    image: '/images/course-intuition.webp',
    color: 'brand-blue',
    gradient: 'from-brand-blue/22 via-white to-brand-cyan/18',
    ring: 'bg-brand-blue',
    offset: 'lg:translate-y-0',
  },
  {
    number: '02',
    title: 'Маршрут развития',
    text: 'Подбираем направления и нагрузку: счет, чтение, творчество, речь и уверенность.',
    icon: 'arrow',
    image: '/images/hero-learning.webp',
    color: 'brand-orange',
    gradient: 'from-brand-orange/22 via-white to-brand-yellow/20',
    ring: 'bg-brand-orange',
    offset: 'lg:translate-y-10',
  },
  {
    number: '03',
    title: 'Занятия 2-3 раза в неделю',
    text: 'Короткие онлайн-уроки с практикой, игровыми механиками и живой обратной связью.',
    icon: 'screen',
    image: '/images/teacher-session.webp',
    color: 'brand-pink',
    gradient: 'from-brand-pink/20 via-white to-brand-purple/18',
    ring: 'bg-brand-pink',
    offset: 'lg:translate-y-0',
  },
  {
    number: '04',
    title: 'Результат',
    text: 'Показываем родителям, что изменилось: внимание, скорость, самостоятельность и смелость.',
    icon: 'check',
    image: '/images/before-after-progress.webp',
    color: 'brand-green',
    gradient: 'from-brand-green/20 via-white to-brand-blue/14',
    ring: 'bg-brand-green',
    offset: 'lg:translate-y-10',
  },
];

export function Program() {
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
    <section ref={sectionRef} className="presentation-slide bg-cream">
      <div className="pointer-events-none absolute left-[-8rem] top-24 h-96 w-96 rounded-full bg-brand-purple/14 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-[-8rem] h-96 w-96 rounded-full bg-brand-yellow/18 blur-3xl" />

      <div className="container-pad relative">
        <div className="rounded-[8px] border-2 border-ink bg-white p-5 shadow-[14px_14px_0_rgba(139,92,246,0.18)] sm:p-8 lg:p-10">
          <div className="grid gap-7 lg:grid-cols-[0.72fr_1fr] lg:items-end">
            <div>
              <span className="comic-label">Программа обучения</span>
              <h2 className="section-title mt-5">Понятный путь от диагностики до результата</h2>
            </div>
            <p className="text-lg font-medium leading-8 text-ink/62">
              Это не список тем, а последовательный сценарий развития: сначала понимаем ребенка, затем строим маршрут, проводим занятия и показываем родителям видимый прогресс.
            </p>
          </div>

          <div className="relative mt-14">
            <div className="absolute left-6 right-6 top-[6.25rem] hidden h-1 rounded-full bg-gradient-to-r from-brand-blue via-brand-orange via-brand-pink to-brand-green lg:block" />

            <div className="grid gap-7 lg:grid-cols-4">
              {steps.map((step, index) => (
                <article
                  key={step.number}
                  className={`group relative min-h-[430px] overflow-hidden rounded-[8px] border-2 border-white bg-gradient-to-br ${step.gradient} p-4 shadow-card transition duration-500 hover:-translate-y-2 hover:shadow-color ${step.offset} ${
                    isVisible ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 140}ms` }}
                >
                  <div className={`absolute -right-14 -top-14 h-36 w-36 rounded-full ${step.ring} opacity-20 blur-2xl transition group-hover:scale-125`} />

                  <div className="relative h-40 overflow-hidden rounded-[8px] bg-white shadow-sm">
                    <img
                      src={step.image}
                      alt={`${step.title}: этап программы обучения`}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-night/28 via-transparent to-white/8" />
                  </div>

                  <div className="relative mt-5 flex items-center justify-between">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-[8px] ${step.ring} text-white shadow-color`}>
                      <Icon name={step.icon} className="h-7 w-7" />
                    </div>
                    <span className="font-display text-5xl font-black text-ink/12">{step.number}</span>
                  </div>

                  <h3 className="relative mt-7 font-display text-2xl font-black leading-tight text-ink">{step.title}</h3>
                  <p className="relative mt-4 text-sm font-semibold leading-7 text-ink/60">{step.text}</p>

                  <div className="relative mt-6 flex items-center gap-2">
                    <span className={`h-2 w-12 rounded-full ${step.ring}`} />
                    <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/42">
                      шаг {index + 1}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="absolute -right-5 top-[6.05rem] z-10 hidden h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-white text-ink shadow-[4px_4px_0_rgba(19,35,27,0.14)] lg:flex">
                      <Icon name="arrow" className="h-5 w-5" />
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}