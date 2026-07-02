'use client';

import { useState } from 'react';

const prompts = [
  'Изобрази кота, который увидел собаку 🐱',
  'Скажи «привет» как робот 🤖',
  'Покажи, как радуешься подарку 🎁',
  'Изобрази, что ешь очень кислый лимон 🍋',
  'Скороговорка: «Шла Саша по шоссе и сосала сушку»',
  'Покажи грустного клоуна 🤡',
  'Изобрази супергероя, спасающего мир 🦸',
  'Скажи «доброе утро» как сонный медведь 🐻',
  'Скороговорка: «Карл у Клары украл кораллы»',
  'Покажи, как удивляешься фокусу ✨',
  'Изобрази важного директора на совещании',
  'Прочитай «Я люблю рисовать» как настоящий актёр 🎭',
];

export function ActingPrompts() {
  const [p, setP] = useState(prompts[0]);
  const [count, setCount] = useState(0);

  function next() {
    let n;
    do {
      n = prompts[Math.floor(Math.random() * prompts.length)];
    } while (n === p);
    setP(n);
    setCount((c) => c + 1);
  }

  return (
    <div className="rounded-[26px] border border-white/80 bg-white/85 p-6 text-center shadow-card backdrop-blur-xl sm:p-8">
      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-pink">Задание {count + 1}</p>
      <div className="mt-4 flex min-h-[150px] items-center justify-center rounded-[20px] bg-gradient-to-br from-brand-pink/10 to-brand-purple/10 p-6">
        <p className="font-display text-2xl font-black leading-snug text-ink sm:text-3xl">{p}</p>
      </div>
      <button onClick={next} className="primary-btn mt-5">Следующее задание →</button>
      <p className="mt-4 text-center text-sm font-semibold text-ink/56">
        Изобрази перед зеркалом или родителями. На занятиях так снимают зажимы и учат держаться на публике 🎭
      </p>
    </div>
  );
}
