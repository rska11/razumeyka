'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const levelConfig = (lvl) => ({
  count: Math.min(3 + Math.floor((lvl - 1) / 2), 8),
  max: lvl < 3 ? 9 : lvl < 6 ? 20 : 50,
  speed: Math.max(420, 820 - lvl * 45),
});

export function FlashCards() {
  const [phase, setPhase] = useState('idle'); // idle | flashing | input | result
  const [level, setLevel] = useState(1);
  const [numbers, setNumbers] = useState([]);
  const [current, setCurrent] = useState(null);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null); // correct | wrong
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const timers = useRef([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  function start() {
    clearTimers();
    const { count, max, speed } = levelConfig(level);
    const nums = Array.from({ length: count }, () => 1 + Math.floor(Math.random() * max));
    setNumbers(nums);
    setAnswer('');
    setResult(null);
    setCurrent(null);
    setPhase('flashing');
    nums.forEach((n, i) => {
      timers.current.push(setTimeout(() => setCurrent(n), i * speed));
      timers.current.push(setTimeout(() => setCurrent(null), i * speed + speed * 0.62));
    });
    timers.current.push(setTimeout(() => setPhase('input'), nums.length * speed + 250));
  }

  function check(e) {
    e?.preventDefault();
    if (answer === '') return;
    const sum = numbers.reduce((a, b) => a + b, 0);
    const ok = Number(answer) === sum;
    setResult({ ok, sum });
    setPhase('result');
    if (ok) {
      setScore((s) => s + level * 10);
      setStreak((s) => {
        const ns = s + 1;
        if (ns % 3 === 0) setLevel((l) => Math.min(l + 1, 10));
        return ns;
      });
    } else {
      setStreak(0);
    }
  }

  return (
    <div className="rounded-[26px] border border-white/80 bg-white/85 p-6 shadow-card backdrop-blur-xl sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <span className="rounded-full bg-brand-blue/12 px-3.5 py-1.5 text-xs font-extrabold text-brand-blue">Уровень {level}</span>
          <span className="rounded-full bg-brand-orange/12 px-3.5 py-1.5 text-xs font-extrabold text-brand-orange">Очки: {score}</span>
          <span className="rounded-full bg-brand-green/14 px-3.5 py-1.5 text-xs font-extrabold text-forest-700">Серия: {streak}</span>
        </div>
      </div>

      <div className="mt-5 flex min-h-[190px] items-center justify-center rounded-[20px] bg-gradient-to-br from-brand-blue/8 to-brand-purple/8 p-6">
        {phase === 'idle' && (
          <div className="text-center">
            <p className="text-lg font-bold text-ink/70">Числа будут мелькать по одному.<br />Сложи их в уме и введи сумму!</p>
            <button onClick={start} className="primary-btn mt-5">Начать игру</button>
          </div>
        )}
        {phase === 'flashing' && (
          <span key={current + '' + Math.random()} className="font-display text-7xl font-black text-brand-blue sm:text-8xl">
            {current ?? ''}
          </span>
        )}
        {phase === 'input' && (
          <form onSubmit={check} className="w-full max-w-xs text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-ink/50">Сколько получилось?</p>
            <input
              type="number"
              autoFocus
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="field-input mt-3 h-16 text-center text-3xl font-black"
              placeholder="?"
            />
            <button type="submit" className="primary-btn mt-4 w-full">Проверить</button>
          </form>
        )}
        {phase === 'result' && (
          <div className="text-center">
            {result.ok ? (
              <p className="font-display text-3xl font-black text-brand-green">Верно! 🎉 +{level * 10}</p>
            ) : (
              <p className="font-display text-2xl font-black text-brand-red">Почти! Правильно: {result.sum}</p>
            )}
            <button onClick={start} className="primary-btn mt-5">Ещё раунд</button>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-sm font-semibold text-ink/56">
        3 верных ответа подряд — новый уровень. А на занятиях дети учатся считать так вообще без подсказок.
      </p>
    </div>
  );
}
