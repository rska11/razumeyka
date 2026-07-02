'use client';

import { useState } from 'react';

export function IntuitionGuess() {
  const [prize, setPrize] = useState(() => Math.floor(Math.random() * 4));
  const [picked, setPicked] = useState(null);
  const [round, setRound] = useState(0);
  const [hits, setHits] = useState(0);

  function pick(i) {
    if (picked !== null) return;
    setPicked(i);
    setRound((r) => r + 1);
    if (i === prize) setHits((h) => h + 1);
  }
  function next() {
    setPrize(Math.floor(Math.random() * 4));
    setPicked(null);
  }

  const pct = round ? Math.round((hits / round) * 100) : 0;
  const revealed = picked !== null;

  return (
    <div className="rounded-[26px] border border-white/80 bg-white/85 p-6 shadow-card backdrop-blur-xl sm:p-8">
      <p className="text-center text-lg font-bold text-ink/72">Под какой карточкой спрятана звезда? Доверься чутью ✨</p>

      <div className="mt-6 grid grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            className={`flex aspect-[3/4] items-center justify-center rounded-[16px] text-4xl font-black transition ${
              revealed
                ? i === prize
                  ? 'bg-brand-orange/18'
                  : 'bg-ink/5 opacity-60'
                : 'bg-gradient-to-br from-brand-blue to-brand-purple text-white hover:-translate-y-1'
            } ${revealed && i === picked && i !== prize ? 'ring-2 ring-brand-red' : ''}`}
          >
            {revealed ? (i === prize ? '⭐' : '·') : '?'}
          </button>
        ))}
      </div>

      <div className="mt-6 text-center">
        {revealed ? (
          <>
            <p className="font-display text-xl font-black text-ink">
              {picked === prize ? 'Есть! Чутьё не подвело 🎯' : 'В этот раз мимо'}
            </p>
            <button onClick={next} className="primary-btn mt-4">Ещё раз</button>
          </>
        ) : (
          <p className="text-sm font-semibold text-ink/50">Выбери карточку</p>
        )}
      </div>

      {round > 0 && (
        <div className="mt-6 rounded-[16px] bg-brand-blue/6 p-4 text-center">
          <p className="text-sm font-bold text-ink/64">
            Твоя интуиция: <span className="text-brand-blue">{pct}%</span> ({hits} из {round})
          </p>
          {round >= 4 && (
            <p className="mt-1 text-xs font-semibold text-ink/52">
              {pct > 25 ? 'Выше случайного (25%) — чутьё работает! 🔮' : 'Случайность даёт ~25%. На занятиях учим замечать детали.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
