/**
 * Cookie-согласие — единый источник правды для всего, что НЕ является
 * технически обязательным (сегодня это только Яндекс.Метрика).
 *
 * Принцип — opt-in: пока пользователь явно не нажал «Принять», ни один
 * аналитический скрипт не подгружается и ни одна аналитическая cookie не
 * ставится. Это то, что проверяет сканер РКН: счётчик не должен срабатывать
 * до согласия (152-ФЗ, ст. 9 + требования к информированному согласию).
 *
 * Решение хранится в собственной cookie (а не только в localStorage), потому
 * что сама cookie и есть запись-доказательство: версия текста, выбор, момент.
 */

export const CONSENT_COOKIE = "znayton_cookie_consent";

/**
 * Версия согласия. Поднимать при изменении состава cookie, целей обработки
 * или списка сервисов — тогда согласие будет спрошено заново у всех.
 */
export const CONSENT_VERSION = 1;

/** Срок жизни решения — год, дальше спрашиваем снова. */
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 365;

/** window-событие: решение принято/изменено (detail — ConsentRecord). */
export const CONSENT_EVENT = "znayton:consent-change";

/** window-событие: открыть плашку настроек (из подвала). */
export const CONSENT_OPEN_EVENT = "znayton:consent-open";

export type ConsentRecord = {
  /** версия текста согласия, на которую соглашались */
  v: number;
  /** согласие на аналитические cookie (Яндекс.Метрика + Вебвизор) */
  analytics: boolean;
  /** момент согласия — фиксируем как доказательство */
  ts: string;
};

function readRawCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  for (const part of document.cookie.split(";")) {
    const chunk = part.trim();
    if (chunk.startsWith(prefix)) return chunk.slice(prefix.length);
  }
  return null;
}

/** Сохранённое решение или null, если решения ещё нет (или оно устарело по версии). */
export function readConsent(): ConsentRecord | null {
  const raw = readRawCookie(CONSENT_COOKIE);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as ConsentRecord;
    if (parsed?.v !== CONSENT_VERSION || typeof parsed.analytics !== "boolean") return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Главная проверка перед подключением любой аналитики. */
export function hasAnalyticsConsent(): boolean {
  return readConsent()?.analytics === true;
}

/** Записать решение пользователя и разослать его подписчикам. */
export function saveConsent(analytics: boolean): ConsentRecord {
  const record: ConsentRecord = { v: CONSENT_VERSION, analytics, ts: new Date().toISOString() };
  if (typeof document !== "undefined") {
    const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; secure" : "";
    const value = encodeURIComponent(JSON.stringify(record));
    document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${CONSENT_MAX_AGE}; samesite=lax${secure}`;
  }
  if (!analytics) clearAnalyticsCookies();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: record }));
  }
  return record;
}

/**
 * Подчистить cookie Метрики при отказе/отзыве согласия.
 * Чужие домены (mc.yandex.ru) нам недоступны — удаляем свои первого лица (_ym*).
 */
export function clearAnalyticsCookies() {
  if (typeof document === "undefined") return;
  const host = location.hostname;
  const parts = host.split(".");
  const domains = [null, host, `.${host}`, parts.length > 2 ? `.${parts.slice(-2).join(".")}` : null];
  for (const chunk of document.cookie.split(";")) {
    const name = chunk.split("=")[0]?.trim();
    if (!name || !name.startsWith("_ym")) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

/** Открыть плашку заново — «Настройки cookie» в подвале. */
export function openConsentSettings() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

/** Подписка на изменение решения. Возвращает отписку. */
export function subscribeConsent(handler: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}
