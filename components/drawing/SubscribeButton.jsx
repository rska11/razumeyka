'use client';

import { useState } from 'react';

// Кнопка оформления доступа к направлению self-study (раздельно по направлениям).
// Не залогинен → на вход; залогинен → принимает оферту, создаём платёж и уходим на ЮKassa.
// returnTo — страница направления: и возврат после логина/оплаты, и определение направления.
export function SubscribeButton({ isLoggedIn, hasAccess, accessUntil, returnTo = '/risovanie' }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accepted, setAccepted] = useState(false);

  if (hasAccess) {
    return (
      <div className="mt-6 rounded-full bg-brand-green/12 px-5 py-3 text-center text-sm font-extrabold text-brand-green">
        Доступ активен{accessUntil ? ` до ${accessUntil}` : ''} ✓
      </div>
    );
  }

  async function go() {
    if (!isLoggedIn) {
      window.location.href = `/login?callbackUrl=${encodeURIComponent(returnTo)}`;
      return;
    }
    if (!accepted) {
      setError('Отметьте согласие с офертой и политикой, чтобы продолжить.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnTo, acceptedOffer: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setError(
        data.error === 'PAYMENTS_DISABLED'
          ? 'Оплата ещё не подключена'
          : data.error === 'OFFER_NOT_ACCEPTED'
            ? 'Нужно принять оферту, чтобы продолжить.'
            : 'Не удалось создать оплату. Попробуйте ещё раз.',
      );
    } catch {
      setError('Сеть недоступна. Попробуйте ещё раз.');
    }
    setLoading(false);
  }

  return (
    <>
      {isLoggedIn && (
        <label className="mt-5 flex items-start gap-2.5 text-left text-xs font-medium leading-5 text-ink/60">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-brand-blue"
          />
          <span>
            Я ознакомлен(а) и принимаю{' '}
            <a href="/offer" target="_blank" rel="noopener" className="font-extrabold text-brand-blue underline">Публичную оферту</a>{' '}
            и{' '}
            <a href="/privacy" target="_blank" rel="noopener" className="font-extrabold text-brand-blue underline">Политику конфиденциальности</a>.
          </span>
        </label>
      )}
      <button
        onClick={go}
        disabled={loading || (isLoggedIn && !accepted)}
        className="primary-btn mt-4 w-full disabled:opacity-50"
      >
        {loading ? 'Создаём оплату…' : isLoggedIn ? 'Оформить доступ' : 'Войти и оформить'}
      </button>
      {error && <p className="mt-2 text-xs font-bold text-brand-red">{error}</p>}
    </>
  );
}
