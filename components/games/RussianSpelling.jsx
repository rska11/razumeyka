'use client';

import { useMemo, useState } from 'react';

const words = [
  { correct: 'корова', wrong: 'карова' },
  { correct: 'собака', wrong: 'сабака' },
  { correct: 'молоко', wrong: 'малако' },
  { correct: 'ворона', wrong: 'варона' },
  { correct: 'заяц', wrong: 'заец' },
  { correct: 'облако', wrong: 'аблако' },
  { correct: 'медведь', wrong: 'медветь' },
  { correct: 'морковь', wrong: 'марковь' },
  { correct: 'ребята', wrong: 'рибята' },
  { correct: 'пенал', wrong: 'пинал' },
];

export function RussianSpelling() {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const w = words[i % words.length];

  const options = useMemo(
    () => (Math.random() < 0.5 ? [w.correct, w.wrong] : [w.wrong, w.correct]),
    [i], // eslint-disable-line react-hooks/exhaustive-deps
  );

  function pick(o) {
    if (picked) return;
    setPicked(o);
    if (o === w.correct) setScore((s) => s + 1);
  }
  function next() {
    setPicked(null);
    setI((v) => v + 1);
  }

  return (
    <div className="rounded-[26px] border border-white/80 bg-white/85 p-6 text-center shadow-card backdrop-blur-xl sm:p-8">
      <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-[0.14em] text-ink/44">
        <span>Слово {i + 1}</span>
        <span>Верно: {score}</span>
      </div>
      <p className="mt-4 text-lg font-bold text-ink/64">Как пишется правильно?</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {options.map((o) => {
          const state = picked
            ? o === w.correct
              ? 'bg-brand-green/16 text-forest-700 ring-2 ring-brand-green/40'
              : o === picked
                ? 'bg-brand-red/12 text-brand-red'
                : 'opacity-55'
            : '';
          return (
            <button key={o} onClick={() => pick(o)} className={`secondary-btn min-h-[60px] text-xl ${state}`}>
              {o}
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="mt-5">
          <p className="font-display text-lg font-black text-ink">
            {picked === w.correct ? 'Верно! 🎉' : `Правильно: ${w.correct}`}
          </p>
          <button onClick={next} className="primary-btn mt-4">Следующее слово</button>
        </div>
      )}

      <p className="mt-5 text-center text-sm font-semibold text-ink/56">Грамотность — это насмотренность. На занятиях учим видеть слово целиком.</p>
    </div>
  );
}
