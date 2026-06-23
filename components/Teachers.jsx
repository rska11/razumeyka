'use client';

import { teachers } from '../data/content.js';

export function Teachers() {
  return (
    <section className="presentation-slide bg-white">
      <div className="container-pad grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <span className="comic-label">Преподаватели</span>
          <h2 className="section-title mt-5">Педагоги, которые умеют включать интерес</h2>
          <p className="mt-6 text-lg font-medium leading-8 text-ink/62">
            Занятие должно быть живым: ребенок чувствует поддержку, но при этом делает усилие и видит свой прогресс.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {teachers.map((teacher) => (
              <article key={teacher.name} className="color-card p-4">
                <div className={`mb-5 h-2 rounded-full ${teacher.color}`} />
                <p className="font-display text-lg font-bold text-ink">{teacher.name}</p>
                <p className="mt-2 text-sm font-extrabold text-ink/48">{teacher.role}</p>
                <p className="mt-5 rounded-full bg-cream px-3 py-2 text-xs font-extrabold text-ink/60">{teacher.experience} опыта</p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-brand-yellow/32 blur-3xl" />
          <img
            src="/images/teacher-session.png"
            alt="Преподаватель ведет онлайн-занятие с ребенком"
            className="relative h-[520px] w-full rounded-[8px] object-cover shadow-color"
          />
          <div className="absolute bottom-5 left-5 right-5 rounded-[8px] border border-white/50 bg-white/82 p-4 shadow-card backdrop-blur-xl">
            <p className="font-display text-2xl font-bold text-ink">1:1 внимание</p>
            <p className="mt-2 text-sm font-bold leading-6 text-ink/58">Педагог видит реакцию ребенка и держит темп занятия живым.</p>
          </div>
        </div>
      </div>
    </section>
  );
}