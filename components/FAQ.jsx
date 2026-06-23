'use client';

import { useState } from 'react';
import { Icon } from './Icon.jsx';

const faqItems = [
  {
    q: 'Подойдёт ли это направление моему ребёнку?',
    a: 'На пробном уроке педагог смотрит уровень ребёнка, его реакцию и темп. Если формат не подойдёт — честно скажем и предложим другое направление. Пробный урок именно для этого и существует.',
  },
  {
    q: 'Что нужно для онлайн-занятий технически?',
    a: 'Компьютер, планшет или телефон с камерой и микрофоном, стабильный интернет и тихое место. Специального оборудования не нужно — занятия проходят в Zoom или аналоге. Ссылку пришлём после записи.',
  },
  {
    q: 'Сколько детей в группе?',
    a: 'До 6 детей. Педагог успевает уделить внимание каждому и адаптирует темп и сложность под конкретного ребёнка. Именно поэтому мы не открываем большие группы.',
  },
  {
    q: 'Как понять, что есть прогресс?',
    a: 'После каждого занятия педагог даёт короткую обратную связь. Вы увидите изменения не по оценкам в дневнике, а по тому, как ребёнок садится за задания, считает, читает и держит себя.',
  },
  {
    q: 'Можно ли перенести или пропустить урок?',
    a: 'Да. О переносе нужно предупредить за 24 часа. Пропущенный урок не сгорает — его можно провести в другое время или компенсируем в следующем месяце.',
  },
  {
    q: 'Чем пробный урок отличается от обычного?',
    a: 'Пробный урок — это полноценное занятие в мини-группе. Педагог знакомится с ребёнком, определяет уровень и показывает формат. Стоит 400 ₽, чтобы отсечь случайные записи.',
  },
  {
    q: 'Что если ребёнку не понравится после пробного?',
    a: 'Это нормально — именно для этого и существует пробный урок. Мы не давим. Можем предложить другое направление, другого педагога или просто расстанемся без обид.',
  },
  {
    q: 'Как проходит оплата?',
    a: 'Пробный урок — 400 ₽, оплачивается онлайн при записи. Пакет на месяц — 7900 ₽, два направления — 12900 ₽. Оплата картой, документы по запросу.',
  },
];

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