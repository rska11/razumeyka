'use client';

import { useState } from 'react';
import { Icon } from './Icon.jsx';
import { faqItems } from '@/data/faq.js';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  function toggle(index) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section className="presentation-slide bg-white">
      <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-brand-blue/8 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-brand-pink/8 blur-3xl" />

      <div className="container-pad relative">
        <div className="mx-auto max-w-[840px]">
          <span className="section-kicker">Вопросы и ответы</span>
          <h2 className="section-title mt-5">Всё, что важно знать перед записью</h2>
          <p className="mt-5 max-w-xl text-lg font-medium leading-8 text-ink/62">
            Если не нашли ответ — напишите нам, ответим в течение 10 минут.
          </p>

          <div className="mt-10 grid gap-3">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={item.q}
                  className={`overflow-hidden rounded-[20px] border transition duration-300 ${
                    isOpen
                      ? 'border-brand-blue/20 bg-gradient-to-br from-brand-blue/6 via-white to-brand-pink/4 shadow-[0_18px_40px_rgba(16,42,86,0.09)]'
                      : 'border-ink/8 bg-white/90 shadow-[0_4px_16px_rgba(16,42,86,0.04)] hover:border-ink/16'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-extrabold leading-7 text-ink">{item.q}</span>
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-white text-ink/50 shadow-sm transition duration-300 ${
                        isOpen
                          ? 'rotate-180 border-brand-blue/20 bg-brand-blue/8 text-brand-blue'
                          : 'border-ink/10'
                      }`}
                    >
                      <Icon name="chevronDown" className="h-4 w-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-ink/6 px-5 pb-5 pt-4">
                      <p className="text-base font-medium leading-8 text-ink/68">{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}