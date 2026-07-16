'use client';

import { useEffect, useState } from 'react';
import { LAUNCH_DATE, LAUNCH_LABEL } from '@/data/launch.js';

function plural(n, one, few, many) {
  const d10 = n % 10;
  const d100 = n % 100;
  if (d10 === 1 && d100 !== 11) return one;
  if (d10 >= 2 && d10 <= 4 && (d100 < 10 || d100 >= 20)) return few;
  return many;
}

// Красивый бейдж запуска с живым обратным отсчётом.
// Отсчёт считается на клиенте (после маунта), чтобы не было рассинхрона гидрации.
export function LaunchBadge({ className = '' }) {
  const [left, setLeft] = useState(null);

  useEffect(() => {
    const tick = () => {
      const diff = LAUNCH_DATE.getTime() - Date.now();
      if (diff <= 0) {
        setLeft({ launched: true });
        return;
      }
      setLeft({
        launched: false,
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
      });
    };
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, []);

  const countdown =
    left && !left.launched
      ? left.days > 0
        ? `через ${left.days} ${plural(left.days, 'день', 'дня', 'дней')}`
        : `через ${left.hours} ${plural(left.hours, 'час', 'часа', 'часов')}`
      : null;

  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/80 py-2 pl-2.5 pr-4 shadow-color backdrop-blur-xl ${className}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue via-brand-purple to-brand-pink text-lg shadow-[0_6px_16px_rgba(59,130,246,0.35)]">
        🚀
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink/45">Запуск направления</span>
        <span className="font-display text-sm font-black text-ink">
          {LAUNCH_LABEL}
          {countdown && (
            <span className="ml-2 rounded-full bg-brand-blue/12 px-2 py-0.5 text-xs font-extrabold text-brand-blue">
              {countdown}
            </span>
          )}
          {left?.launched && (
            <span className="ml-2 rounded-full bg-brand-green/14 px-2 py-0.5 text-xs font-extrabold text-brand-green">
              уже открыто
            </span>
          )}
        </span>
      </span>
    </div>
  );
}
