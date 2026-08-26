'use client';

import { openConsentSettings } from '@/lib/consent';

/** Кнопка «Настройки cookie» — открывает плашку заново (подвал, страница /cookies). */
export function CookieSettingsButton({ className, children }) {
  return (
    <button type="button" onClick={openConsentSettings} className={className}>
      {children}
    </button>
  );
}
