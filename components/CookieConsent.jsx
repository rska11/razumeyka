'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { CONSENT_OPEN_EVENT, readConsent, saveConsent } from '@/lib/consent';

/**
 * Плашка cookie-согласия (opt-in).
 *
 * Пока решения нет — аналитика не подключена (см. components/analytics/YandexMetrika.jsx),
 * плашка висит внизу и не перекрывает контент. Отказ сделан такой же простой,
 * как согласие (одинаковые по заметности кнопки, никаких «крестик = согласен»).
 * Решение можно поменять в любой момент — «Настройки cookie» в подвале.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    const saved = readConsent();
    setCurrent(saved);
    if (!saved) setVisible(true); // решения ещё нет — спрашиваем

    const open = () => {
      setCurrent(readConsent());
      setVisible(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open);
  }, []);

  const decide = useCallback(
    (analytics) => {
      const wasAllowed = readConsent()?.analytics === true;
      saveConsent(analytics);
      setVisible(false);
      // Отзыв согласия: уже загруженный счётчик выгрузить нельзя —
      // cookie удалены в saveConsent, страницу перезагружаем без Метрики.
      if (wasAllowed && !analytics) window.location.reload();
    },
    [],
  );

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[120] px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] sm:px-4 sm:pb-4"
      role="dialog"
      aria-live="polite"
      aria-label="Использование cookie"
    >
      <div className="pointer-events-auto mx-auto max-w-xl rounded-[16px] border border-ink/8 bg-white/96 p-3 text-ink shadow-luxe backdrop-blur-xl sm:max-w-3xl sm:rounded-[20px] sm:p-4 lg:max-w-4xl">
        <div className="flex items-start gap-3">
          <span aria-hidden className="hidden h-9 w-9 shrink-0 place-items-center rounded-[12px] bg-brand-blue/10 text-lg sm:grid">
            🍪
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold leading-[1.45] text-ink/70 sm:text-[13px] sm:leading-5">
              <span className="font-extrabold text-ink">Обязательные cookie</span> нужны, чтобы работал вход в кабинет
              и сохранялся прогресс уроков. <span className="font-extrabold text-ink">Аналитические</span> —
              Яндекс.Метрика, включая Вебвизор, — подключаются только с вашего согласия и помогают нам понять,
              какие уроки детям заходят. Отказ ничего не ломает.
            </p>
            <p className="mt-1.5 text-[11px] font-semibold leading-[1.45] text-ink/48 sm:text-[12px]">
              Подробности —{' '}
              <Link href="/cookies" className="font-extrabold text-brand-blue underline decoration-brand-blue/30 underline-offset-2">
                какие cookie мы используем
              </Link>{' '}
              и{' '}
              <Link href="/privacy" className="font-extrabold text-brand-blue underline decoration-brand-blue/30 underline-offset-2">
                политика конфиденциальности
              </Link>
              .{current ? (
                <span className="ml-1">Сейчас аналитика {current.analytics ? 'включена' : 'выключена'}.</span>
              ) : null}
            </p>
          </div>
        </div>

        {/* Кнопки равнозначны: отказаться так же просто, как согласиться. */}
        <div className="mt-3 flex gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => decide(false)}
            className="inline-flex min-h-[42px] flex-1 items-center justify-center rounded-full border-2 border-ink/12 bg-white px-3 text-[12px] font-extrabold text-ink transition hover:border-ink/25 focus:outline-none focus:ring-4 focus:ring-ink/10 sm:flex-none sm:px-5 sm:text-[13px]"
          >
            Только необходимые
          </button>
          <button
            type="button"
            onClick={() => decide(true)}
            className="inline-flex min-h-[42px] flex-1 items-center justify-center rounded-full bg-night px-3 text-[12px] font-extrabold text-porcelain transition hover:bg-ink focus:outline-none focus:ring-4 focus:ring-brand-blue/24 sm:flex-none sm:px-6 sm:text-[13px]"
          >
            Принять все
          </button>
        </div>
      </div>
    </div>
  );
}
