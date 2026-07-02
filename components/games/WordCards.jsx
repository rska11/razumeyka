'use client';

import { useMemo, useState } from 'react';

const deck = [
  { emoji: '🐱', en: 'cat', ru: 'кот' },
  { emoji: '🐶', en: 'dog', ru: 'собака' },
  { emoji: '🍎', en: 'apple', ru: 'яблоко' },
  { emoji: '☀️', en: 'sun', ru: 'солнце' },
  { emoji: '🏠', en: 'house', ru: 'дом' },
  { emoji: '⭐', en: 'star', ru: 'звезда' },
  { emoji: '🐟', en: 'fish', ru: 'рыба' },
  { emoji: '🌸', en: 'flower', ru: 'цветок' },
];

function speak(word) {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    const u = new SpeechSynthesisUtterance(word);
    u.lang = 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }
}

function shuffle(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function WordCards() {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const card = deck[i % deck.length];

  const options = useMemo(() => {
    const others = shuffle(deck.filter((d) => d.en !== card.en)).slice(0, 2);
    return shuffle([card, ...others]).map((d) => d.en);
  }, [i]); // eslint-disable-line react-hooks/exhaustive-deps

  function pick(en) {
    if (picked) return;
    setPicked(en);
    if (en === card.en) setScore((s) => s + 1);
    speak(card.en);
  }
  function next() {
    setPicked(null);
    setI((v) => v + 1);
  }

  return (
    <div className="rounded-[26px] border border-white/80 bg-white/85 p-6 text-center shadow-card backdrop-blur-xl sm:p-8">
      <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-[0.14em] text-ink/44">
        <span>Карточка {i + 1}</span>
        <span>Верно: {score}</span>
      </div>

      <div className="mx-auto mt-4 flex h-32 w-32 items-center justify-center rounded-[24px] bg-gradient-to-br from-brand-blue/10 to-brand-pink/10 text-7xl">
        {card.emoji}
      </div>
      <p className="mt-3 text-sm font-bold text-ink/56">Как это по-английски?</p>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
        {options.map((en) => {
          const state = picked
            ? en === card.en
              ? 'bg-brand-green/16 text-forest-700'
              : en === picked
                ? 'bg-brand-red/12 text-brand-red'
                : 'opacity-60'
            : '';
          return (
            <button key={en} onClick={() => pick(en)} className={`secondary-btn min-h-[52px] ${state}`}>
              {en}
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="mt-5">
          <p className="font-display text-lg font-black text-ink">
            {card.en} — {card.ru}{' '}
            <button onClick={() => speak(card.en)} className="align-middle text-brand-blue" aria-label="Произнести">🔊</button>
          </p>
          <button onClick={next} className="primary-btn mt-4">Следующее слово</button>
        </div>
      )}

      <p className="mt-5 text-center text-sm font-semibold text-ink/56">Нажми 🔊 — услышишь правильное произношение. Так дети и запоминают слова.</p>
    </div>
  );
}
