'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export function AccountButton({ className = '' }) {
  const { status } = useSession();
  const authed = status === 'authenticated';
  const [authEnabled, setAuthEnabled] = useState(null);

  useEffect(() => {
    fetch('/api/public-status')
      .then((r) => r.json())
      .then((d) => setAuthEnabled(Boolean(d.authEnabled)))
      .catch(() => setAuthEnabled(true));
  }, []);

  // Вошедшим всегда показываем «Кабинет». Гостям — «Войти» только если
  // авторизация включена (и статус уже загружен), иначе кнопку прячем.
  if (!authed && authEnabled !== true) return null;

  return (
    <Link
      href={authed ? '/cabinet' : '/login'}
      className={`inline-flex min-h-[54px] items-center gap-2 rounded-full border-2 border-ink/12 bg-white/78 px-6 py-3 text-base font-extrabold text-ink shadow-card backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-brand-blue/38 hover:bg-white ${className}`}
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 11a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0" />
      </svg>
      {authed ? 'Кабинет' : 'Войти'}
    </Link>
  );
}
