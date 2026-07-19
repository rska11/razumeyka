'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const ACK_KEY = 'razumeyka_cookie_ack';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(ACK_KEY) !== '1') setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function acknowledge() {
    try {
      localStorage.setItem(ACK_KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[120] px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] sm:px-4 sm:pb-4"
      role="region"
      aria-label="Уведомление об использовании cookie"
    >
      {/* Светлая, компактная плашка «в характере» бренда: польза впереди,
          подразумеваемое согласие зашито во фразу (юр-покрытие), детали про
          аналитику — в политике. Тёмный вариант отпугивал (звучал как слежка). */}
      <div className="pointer-events-auto mx-auto flex max-w-xl items-center gap-2.5 rounded-[14px] border border-ink/8 bg-white/95 p-2 text-ink shadow-luxe backdrop-blur-xl sm:gap-3.5 sm:rounded-[18px] sm:p-3">
        <span aria-hidden className="hidden h-9 w-9 shrink-0 place-items-center rounded-[12px] bg-brand-blue/10 text-lg sm:grid">
          🍪
        </span>
        <p className="min-w-0 flex-1 text-[11px] font-semibold leading-[1.35] text-ink/64 sm:text-[13px] sm:leading-5">
          Используем cookie, чтобы сайт был удобнее. Продолжая, вы принимаете{' '}
          <Link href="/privacy" className="font-extrabold text-brand-blue underline decoration-brand-blue/30 underline-offset-2">
            политику конфиденциальности
          </Link>
          .
        </p>
        {/* Тихий крестик вместо яркой кнопки: согласие зашито во фразу
            «Продолжая…», а закрытие не читается как «на что-то подписываюсь». */}
        <button
          type="button"
          onClick={acknowledge}
          aria-label="Закрыть уведомление"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-lg leading-none text-ink/40 transition hover:bg-ink/5 hover:text-ink/70"
        >
          <span aria-hidden>✕</span>
        </button>
      </div>
    </div>
  );
}
