'use client';

import { useState } from 'react';

export function PayButton({ enrollmentId, label }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function pay() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url; // переход на оплату ЮKassa
        return;
      }
      setError(
        data.error === 'PAYMENTS_DISABLED'
          ? 'Оплата ещё не подключена'
          : data.error === 'NO_PRICE'
            ? 'Не задана цена тарифа'
            : 'Не удалось создать оплату. Попробуйте ещё раз.',
      );
    } catch {
      setError('Сеть недоступна. Попробуйте ещё раз.');
    }
    setLoading(false);
  }

  return (
    <div>
      <button
        type="button"
        onClick={pay}
        disabled={loading}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-brand-green px-5 py-2 text-sm font-extrabold text-white shadow-color transition hover:-translate-y-0.5 hover:bg-brand-green/90 disabled:opacity-50"
      >
        {loading ? 'Создаём оплату…' : label}
      </button>
      {error && <p className="mt-1 text-xs font-bold text-brand-red">{error}</p>}
    </div>
  );
}
