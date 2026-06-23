'use client';

import { testimonials } from '../data/content.js';

export function Testimonials() {
  return (
    <section id="reviews" className="presentation-slide bg-cream">
      <div className="container-pad">
        <div className="grid gap-7 lg:grid-cols-[0.9fr_0.7fr] lg:items-end">
          <div>
            <span className="comic-label">Отзывы родителей</span>
            <h2 className="section-title mt-5">
              Когда ребенок раскрывается, это видно дома
            </h2>
          </div>
          <p className="text-lg font-medium leading-8 text-ink/62">
            Мы оставили отзывы спокойными и конкретными: про внимание, чтение, уверенность и изменения в учебном поведении.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((review, index) => (
            <article
              key={review.name}
              className={`premium-card p-7 ${index === 1 ? 'lg:-translate-y-6' : ''}`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-gold-100 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-gold-500">
                  {review.course}
                </span>
                <span className="rounded-full bg-brand-green/12 px-3 py-1 text-xs font-extrabold text-brand-green">
                  {review.result}
                </span>
              </div>
              <p className="mt-7 text-lg font-semibold leading-8 text-ink/72">"{review.text}"</p>
              <div className="mt-8 flex items-center gap-3 border-t border-ink/8 pt-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-pink font-display text-sm font-bold text-white">
                  {review.name.slice(0, 1)}
                </span>
                <p className="font-extrabold text-ink">{review.name}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}