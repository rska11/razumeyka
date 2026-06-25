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
    <div className="fixed inset-x-0 bottom-0 z-[120] px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-[18px] border border-white/80 bg-white/95 p-4 shadow-color backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <p className="text-sm font-medium leading-6 text-ink/70">
          <span aria-hidden className="mr-1">🍪</span>
          Мы используем cookie. Продолжая пользоваться сайтом, вы соглашаетесь с их использованием; отключить можно в настройках браузера.{' '}
          <Link href="/privacy" className="font-extrabold text-brand-blue underline">Подробнее</Link>.
        </p>
        <button
          type="button"
          onClick={acknowledge}
          className="shrink-0 rounded-full bg-night px-6 py-2.5 text-sm font-extrabold text-white shadow-color transition hover:-translate-y-0.5 hover:bg-ink"
        >
          Понятно
        </button>
      </div>
    </div>
  );
}
