'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const ALL = [
  { c: 'Эмоции', t: 'Покажи, как радуешься подарку', e: '🎁' },
  { c: 'Эмоции', t: 'Изобрази, что съел очень кислый лимон', e: '🍋' },
  { c: 'Эмоции', t: 'Покажи грустного клоуна', e: '🤡' },
  { c: 'Эмоции', t: 'Удивись так, будто увидел настоящее чудо', e: '✨' },
  { c: 'Эмоции', t: 'Испугайся паучка, а потом рассмейся над собой', e: '😱' },
  { c: 'Животные', t: 'Изобрази кота, который увидел собаку', e: '🐱' },
  { c: 'Животные', t: 'Пройдись важно, как петух во дворе', e: '🐓' },
  { c: 'Животные', t: 'Покажи сонного медведя, который проснулся весной', e: '🐻' },
  { c: 'Животные', t: 'Попрыгай, как весёлый зайчик на полянке', e: '🐰' },
  { c: 'Скороговорки', t: 'Шла Саша по шоссе и сосала сушку', e: '🗣️' },
  { c: 'Скороговорки', t: 'Карл у Клары украл кораллы', e: '🗣️' },
  { c: 'Скороговорки', t: 'От топота копыт пыль по полю летит', e: '🗣️' },
  { c: 'Скороговорки', t: 'Ехал Грека через реку, видит Грека — в реке рак', e: '🗣️' },
  { c: 'Перевоплощения', t: 'Скажи «привет» как робот', e: '🤖' },
  { c: 'Перевоплощения', t: 'Прочитай стишок как строгий учитель', e: '👩‍🏫' },
  { c: 'Перевоплощения', t: 'Стань супергероем, спасающим город', e: '🦸' },
  { c: 'Перевоплощения', t: 'Изобрази важного директора на совещании', e: '💼' },
  { c: 'Перевоплощения', t: 'Спой «С днём рождения» как оперный певец', e: '🎤' },
];
const CATS = ['Все', 'Эмоции', 'Животные', 'Скороговорки', 'Перевоплощения'];
const catColor = {
  Эмоции: 'bg-brand-orange/14 text-brand-orange',
  Животные: 'bg-brand-green/16 text-forest-700',
  Скороговорки: 'bg-brand-blue/12 text-brand-blue',
  Перевоплощения: 'bg-brand-pink/14 text-brand-pink',
};

function shuffle(a) {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export function ActingPrompts() {
  const [cat, setCat] = useState('Все');
  const [count, setCount] = useState(1);
  const [current, setCurrent] = useState(ALL[0]);
  const queue = useRef([]);

  const pool = useMemo(() => (cat === 'Все' ? ALL : ALL.filter((p) => p.c === cat)), [cat]);

  // берём из перемешанной очереди — без повторов, пока не пройдём весь пул
  function pick(p, fresh) {
    if (fresh || queue.current.length === 0) queue.current = shuffle(p);
    const item = queue.current.shift();
    if (item) setCurrent(item);
  }

  useEffect(() => {
    pick(ALL, true);
  }, []);

  function selectCat(c) {
    setCat(c);
    const p = c === 'Все' ? ALL : ALL.filter((x) => x.c === c);
    pick(p, true);
    setCount(1);
  }
  function next() {
    pick(pool, false);
    setCount((v) => v + 1);
  }

  return (
    <div className="rounded-[26px] border border-white/80 bg-white/85 p-6 shadow-card backdrop-blur-xl sm:p-8">
      <div className="flex flex-wrap justify-center gap-2">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => selectCat(c)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-extrabold transition ${
              cat === c ? 'bg-brand-pink text-white' : 'bg-ink/5 text-ink/60 hover:bg-ink/10'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="relative mt-5 flex min-h-[210px] flex-col items-center justify-center overflow-hidden rounded-[22px] bg-gradient-to-br from-brand-pink/12 via-brand-purple/8 to-brand-blue/12 p-6 text-center">
        <span className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] ${catColor[current.c]}`}>
          {current.c}
        </span>
        <span className="mt-3 text-6xl">{current.e}</span>
        <p className="mt-3 font-display text-2xl font-black leading-snug text-ink sm:text-[1.7rem]">{current.t}</p>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-sm font-bold text-ink/44">Задание {count}</span>
        <button onClick={next} className="primary-btn min-h-0 px-6 py-3">Следующее →</button>
      </div>

      <p className="mt-4 text-center text-sm font-semibold text-ink/56">
        Изобрази перед зеркалом или родными. Так на занятиях снимают зажимы и учат держаться на публике 🎭
      </p>
    </div>
  );
}
