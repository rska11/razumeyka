'use client';

import { useState } from 'react';

// Кнопка оформления подписки на self-study библиотеку.
// Не залогинен → на вход; залогинен → создаём платёж и уходим на ЮKassa.
export function SubscribeButton({ isLoggedIn, hasAccess, accessUntil }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (hasAccess) {
    return (
      <div className="mt-6 rounded-full bg-brand-green/12 px-5 py-3 text-center text-sm font-extrabold text-brand-green">
        Подписка активна{accessUntil ? ` до ${accessUntil}` : ''} ✓
      </div>
    );
  }

  async function go() {
    if (!isLoggedIn) {
      window.location.href = '/login?callbackUrl=/risovanie';
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/subscription/create', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setError(
        data.error === 'PAYMENTS_DISABLED'
          ? 'Оплата ещё не подключена'
          : 'Не удалось создать оплату. Попробуйте ещё раз.',
      );
    } catch {
      setError('Сеть недоступна. Попробуйте ещё раз.');
    }
    setLoading(false);
  }

  return (
    <>
      <button onClick={go} disabled={loading} className="primary-btn mt-6 w-full disabled:opacity-50">
        {loading ? 'Создаём оплату…' : isLoggedIn ? 'Оформить подписку' : 'Войти и оформить'}
      </button>
      {error && <p className="mt-2 text-xs font-bold text-brand-red">{error}</p>}
    </>
  );
}
