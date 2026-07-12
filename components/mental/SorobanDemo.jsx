'use client';

// Живая демка абакуса в блоке «Что такое ментальная арифметика»:
// взрослый (или ребёнок) двигает бусины и за минуту понимает суть метода.

import { useState } from 'react';
import { Soroban } from './Soroban.jsx';

const CHALLENGES = [3, 7, 9];

export function SorobanDemo() {
  const [value, setValue] = useState(0);
  const [target, setTarget] = useState(7);
  const solved = value === target;

  return (
    <div className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-card backdrop-blur-xl sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-extrabold text-ink">Попробуйте сами — это и есть абакус</p>
        <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-extrabold text-brand-blue">живая демка</span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_150px] sm:items-center">
        <div className="mx-auto">
          <Soroban value={value} onChange={setValue} className="h-[250px] w-auto" />
        </div>
        <div className="text-center sm:text-left">
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-ink/42">Набрано</p>
          <p className="font-display text-5xl font-extrabold text-ink">{value}</p>
          <p className="mt-2 text-xs font-semibold leading-5 text-ink/54">
            Нижняя бусина — 1, верхняя — 5. Нажимайте на бусины.
          </p>
        </div>
      </div>

      <div className={`mt-4 rounded-2xl px-4 py-3 transition ${solved ? 'bg-brand-green/12' : 'bg-cream/70'}`}>
        {solved ? (
          <p className="text-sm font-extrabold text-brand-green">
            Получилось! Вы только что посчитали как на уроке ментальной арифметики 🎉
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-ink/64">Задание: наберите число</p>
            {CHALLENGES.map((n) => (
              <button
                key={n}
                onClick={() => {
                  setTarget(n);
                  setValue(0);
                }}
                className={`grid h-9 w-9 place-items-center rounded-full text-sm font-extrabold transition ${
                  target === n ? 'bg-brand-blue text-white shadow-card' : 'bg-white text-ink/60 hover:bg-brand-blue/10'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
