'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

function shuffled() {
  const arr = Array.from({ length: 25 }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function SchulteTable() {
  const [grid, setGrid] = useState(() => Array.from({ length: 25 }, (_, i) => i + 1));
  const [next, setNext] = useState(1);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [time, setTime] = useState(0);
  const [best, setBest] = useState(null);
  const [wrong, setWrong] = useState(null);
  const startAt = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    const b = Number(localStorage.getItem('schulte-best'));
    if (b) setBest(b);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const tick = useCallback(() => {
    setTime((performance.now() - startAt.current) / 1000);
    raf.current = requestAnimationFrame(tick);
  }, []);

  function begin() {
    setGrid(shuffled());
    setNext(1);
    setDone(false);
    setStarted(true);
    setTime(0);
    startAt.current = performance.now();
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
  }

  function click(n) {
    if (!started || done) return;
    if (n !== next) {
      setWrong(n);
      setTimeout(() => setWrong(null), 280);
      return;
    }
    if (n === 25) {
      cancelAnimationFrame(raf.current);
      const t = (performance.now() - startAt.current) / 1000;
      setTime(t);
      setStarted(false);
      setDone(true);
      if (!best || t < best) {
        setBest(t);
        localStorage.setItem('schulte-best', String(t));
      }
    } else {
      setNext(n + 1);
    }
  }

  return (
    <div className="rounded-[26px] border border-white/80 bg-white/85 p-6 shadow-card backdrop-blur-xl sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <span className="rounded-full bg-brand-orange/12 px-3.5 py-1.5 text-xs font-extrabold text-brand-orange">
            Время: {time.toFixed(1)} с
          </span>
          {best && (
            <span className="rounded-full bg-brand-green/14 px-3.5 py-1.5 text-xs font-extrabold text-forest-700">
              Рекорд: {best.toFixed(1)} с
            </span>
          )}
        </div>
        {started && (
          <span className="rounded-full bg-brand-blue px-3.5 py-1.5 text-sm font-black text-white">Найди: {next}</span>
        )}
      </div>

      <div className="relative mt-5">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-2">
          {grid.map((n) => (
            <button
              key={n}
              onClick={() => click(n)}
              disabled={!started}
              className={`aspect-square rounded-[12px] text-lg font-black transition sm:text-xl ${
                wrong === n
                  ? 'bg-brand-red/20 text-brand-red'
                  : n < next
                    ? 'bg-brand-green/16 text-forest-700'
                    : 'border border-ink/8 bg-white text-ink hover:bg-brand-blue/8'
              } ${!started ? 'opacity-70' : ''}`}
            >
              {n}
            </button>
          ))}
        </div>

        {!started && (
          <div className="absolute inset-0 flex items-center justify-center rounded-[16px] bg-white/70 backdrop-blur-sm">
            <div className="text-center">
              {done ? (
                <p className="font-display text-2xl font-black text-brand-green">Готово за {time.toFixed(1)} с! 🎉</p>
              ) : (
                <p className="max-w-xs text-lg font-bold text-ink/72">Находи числа по порядку 1→25 как можно быстрее</p>
              )}
              <button onClick={begin} className="primary-btn mt-4">{done ? 'Ещё раз' : 'Старт'}</button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-sm font-semibold text-ink/56">
        Классическое упражнение скорочтения: расширяет «поле зрения» и внимание. Взрослым тоже полезно 😉
      </p>
    </div>
  );
}
