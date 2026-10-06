// Единственный источник правды по ценам self-study доступа (тарифы старых
// групповых записей — в lib/pricing.ts). Без зависимостей (ни Prisma,
// ни next/*), поэтому его можно импортировать откуда угодно: из серверных
// страниц, клиентских компонентов и файлов data/*.js.
// Чтобы поменять цену — правьте только этот файл.

export const DRAWING_PRICE = 1490; // ₽ за 30 дней
export const MENTAL_PRICE = 1490; // ₽ за 30 дней
export const SCHOOL_PREP_PRICE = 1190; // ₽ за 45 дней
export const COMPARE_PRICE = 4490; // зачёркнутая «старая» цена
// Цена по умолчанию для страниц без своего направления (лендинги языков и т.п.).
export const SUBSCRIPTION_PRICE = DRAWING_PRICE;

export const MIN_PRICE = Math.min(DRAWING_PRICE, MENTAL_PRICE, SCHOOL_PREP_PRICE);

/**
 * 1490 → «1 490 ₽». Пробелы неразрывные, чтобы цена не рвалась на две строки.
 * Форматируем вручную, а не через toLocaleString: у Node и браузеров разный
 * разделитель разрядов, и это ломало бы гидратацию клиентских компонентов.
 */
export function rub(amount) {
  return `${String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')}\u00a0₽`;
}
