// Цены тарифов (синхронно с мастером на лендинге, FinalCTA: DURATIONS)
const PRICES: Record<string, { collective: number; individual: number }> = {
  "1m": { collective: 10800, individual: 16200 },
  "3m": { collective: 25740, individual: 39000 },
  "6m": { collective: 46280, individual: 70200 },
};

export const TARIFF_LABELS: Record<string, string> = {
  "1m": "1 месяц",
  "3m": "3 месяца",
  "6m": "6 месяцев",
};

/** Цена записи в рублях по формату и тарифу. 0 — если тариф неизвестен. */
export function enrollmentPrice(format: string, tariff: string | null | undefined): number {
  const t = PRICES[tariff ?? ""];
  if (!t) return 0;
  return format === "individual" ? t.individual : t.collective;
}

export function rub(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}
