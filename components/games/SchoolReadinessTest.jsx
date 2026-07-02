'use client';

import { useState } from 'react';

const questions = [
  'Ребёнок знает буквы и читает по слогам?',
  'Считает в пределах десяти и обратно?',
  'Может усидеть за одним занятием 15–20 минут?',
  'Пересказывает короткую историю и отвечает на вопросы?',
  'Правильно держит карандаш, раскрашивает не вылезая за контур?',
  'Слушает взрослого и выполняет просьбу из 2–3 шагов?',
  'Спокойно реагирует на замечание, не бросает после первой ошибки?',
];
const options = [
  { label: 'Да', v: 2 },
  { label: 'Иногда', v: 1 },
  { label: 'Пока нет', v: 0 },
];

export function SchoolReadinessTest() {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  function answer(v) {
    const ns = score + v;
    if (i + 1 >= questions.length) {
      setScore(ns);
      setDone(true);
    } else {
      setScore(ns);
      setI(i + 1);
    }
  }
  function restart() {
    setI(0);
    setScore(0);
    setDone(false);
  }

  const max = questions.length * 2;
  const pct = Math.round((score / max) * 100);
  const verdict =
    pct >= 80
      ? { t: 'Отличная готовность! 🎉', color: 'text-brand-green', d: 'Ребёнок хорошо готов к школе. Поддерживайте интерес и не перегружайте — этого достаточно.' }
      : pct >= 50
        ? { t: 'Готовность на подходе', color: 'text-brand-orange', d: 'Хорошая база, но пару навыков — особенно внимание и усидчивость — стоит мягко подтянуть до школы.' }
        : { t: 'Есть над чем поработать', color: 'text-brand-red', d: 'Не переживайте — до школы всё выравнивается. Сфокусируйтесь на внимании, речи и усидчивости.' };

  if (done) {
    return (
      <div className="rounded-[26px] border border-white/80 bg-white/85 p-6 text-center shadow-card backdrop-blur-xl sm:p-8">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-purple">
          <span className="font-display text-3xl font-black text-white">{pct}%</span>
        </div>
        <p className={`mt-5 font-display text-2xl font-black ${verdict.color}`}>{verdict.t}</p>
        <p className="mx-auto mt-3 max-w-md text-base font-medium leading-7 text-ink/68">{verdict.d}</p>
        <button onClick={restart} className="secondary-btn mt-5">Пройти заново</button>
      </div>
    );
  }

  return (
    <div className="rounded-[26px] border border-white/80 bg-white/85 p-6 shadow-card backdrop-blur-xl sm:p-8">
      <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-[0.14em] text-ink/44">
        <span>Вопрос {i + 1} из {questions.length}</span>
        <span>Тест готовности</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/8">
        <div className="h-full rounded-full bg-brand-blue transition-all" style={{ width: `${((i + 1) / questions.length) * 100}%` }} />
      </div>

      <p className="mt-6 min-h-[64px] font-display text-xl font-extrabold leading-tight text-ink sm:text-2xl">{questions[i]}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {options.map((o) => (
          <button key={o.label} onClick={() => answer(o.v)} className="secondary-btn min-h-[52px]">
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
