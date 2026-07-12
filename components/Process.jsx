'use client';

import { process } from '../data/content.js';
import { Icon } from './Icon.jsx';

export function Process() {
  return (
    <section className="presentation-slide bg-forest-900 text-porcelain">
      <div className="container-pad">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1fr] lg:items-end">
          <div>
            <span className="inline-flex rounded-full border border-white/14 bg-white/8 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-gold-300">
              Как проходят занятия
            </span>
            <h2 className="mt-5 font-display text-[2.25rem] font-bold leading-[1.06] tracking-[-0.02em] sm:text-5xl">
              Комфортно для семьи, интересно для ребенка
            </h2>
          </div>
          <p className="text-lg font-medium leading-8 text-white/62">
            Онлайн формат здесь не компромисс, а продуманная среда: понятные шаги, игровые методы и удобный темп работают вместе.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {process.map(([icon, title, text], index) => (
            <article
              key={title}
              className="group rounded-[8px] border border-white/10 bg-white/7 p-6 shadow-insetline backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/12"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[8px] bg-gold-300 text-forest-900">
                  <Icon name={icon} className="h-7 w-7" />
                </div>
                <span className="font-display text-4xl font-bold text-white/12 transition group-hover:text-gold-300/38">0{index + 1}</span>
              </div>
              <h3 className="mt-8 font-display text-xl font-bold">{title}</h3>
              <p className="mt-4 text-sm font-medium leading-7 text-white/60">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}