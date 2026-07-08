export const METRIKA_ID = 110320728;

/** Цель в Яндекс.Метрику. Безопасно вне браузера и когда счётчик не подключён (dev). */
export function reachGoal(goal: string, params?: Record<string, unknown>) {
  const w = typeof window !== "undefined" ? (window as unknown as { ym?: (...args: unknown[]) => void }) : null;
  if (typeof w?.ym === "function") w.ym(METRIKA_ID, "reachGoal", goal, params);
}
