'use client';

import { useState } from 'react';
import { LAUNCH_LABEL } from '@/data/launch.js';

// Форма листа ожидания: показывается вместо блока оплаты на «скоро»-направлениях.
// Собирает email в таблицу Waitlist; на запуске по нему делается рассылка.
export function WaitlistForm({ direction, source = 'card', className = '', compact = false }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | loading | done | error
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    if (state === 'loading') return;
    setState('loading');
    setError('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, direction, source }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Не получилось. Попробуйте ещё раз.');
        setState('error');
        return;
      }
      setState('done');
    } catch {
      setError('Нет связи. Попробуйте ещё раз.');
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <div className={`rounded-[18px] border border-brand-green/25 bg-brand-green/8 px-4 py-4 text-center ${className}`}>
        <p className="text-sm font-extrabold text-brand-green">Готово! 🎉</p>
        <p className="mt-1 text-xs font-semibold leading-5 text-ink/64">
          Напишем на <b>{email}</b>, как только откроем направление.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={className}>
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-orange">Запуск {LAUNCH_LABEL}</p>
      {!compact && (
        <p className="mt-1.5 text-sm font-semibold leading-6 text-ink/64">
          Оставьте email — сообщим, как только направление откроется, и дадим первые уроки бесплатно.
        </p>
      )}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ваш@email.ru"
          className="field-input h-[46px] flex-1"
          aria-label="Email для уведомления о запуске"
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="inline-flex h-[46px] items-center justify-center gap-2 rounded-full bg-brand-blue px-5 text-sm font-extrabold text-white shadow-color transition hover:-translate-y-0.5 hover:bg-brand-blue/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === 'loading' ? 'Отправляем…' : 'Сообщить о запуске'}
        </button>
      </div>
      {state === 'error' && <p className="mt-2 text-xs font-bold text-brand-red">{error}</p>}
    </form>
  );
}
