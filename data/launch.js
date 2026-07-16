// Единый источник даты запуска направлений. Используется бейджем, карточками
// на главной и «скоро»-страницами направлений, чтобы дата не расходилась.
//
// Готовые направления (рисование, ментальная арифметика) открыты всегда.
// Остальные открываются с этой даты — до неё показываем лист ожидания.

export const LAUNCH_DATE = new Date('2026-07-25T10:00:00+03:00');
export const LAUNCH_LABEL = '25 июля';

// Слаги направлений, которые уже открыты как полноценный продукт (self-study).
// Остальные считаются «скоро» и показывают лист ожидания.
export const READY_DIRECTIONS = new Set(['right-brain-drawing', 'mental-arithmetic']);

export function isDirectionReady(slug) {
  return READY_DIRECTIONS.has(slug);
}

export function isLaunched(now = Date.now()) {
  return now >= LAUNCH_DATE.getTime();
}
