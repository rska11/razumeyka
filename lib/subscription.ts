import { prisma } from "@/lib/prisma";

// Доступ к self-study библиотеке — РАЗДЕЛЬНО ПО НАПРАВЛЕНИЯМ.
// Оплата открывает конкретное направление; чтобы открыть второе — отдельная оплата.
// Пилот: оплаченный период доступа без автосписания (продлевается вручную/новой оплатой).

export const SUBSCRIPTION_PRICE = 490; // ₽ за период (по умолчанию)
export const SUBSCRIPTION_MONTHS = 1;

// Направления, которые продаются как self-study доступ.
export const DIRECTIONS = {
  risovanie: { path: "/risovanie", title: "Рисование" },
  "mentalnaya-arifmetika": { path: "/mentalnaya-arifmetika", title: "Ментальная арифметика" },
  "podgotovka-k-shkole": { path: "/podgotovka-k-shkole", title: "Подготовка к школе" },
} as const;

export type DirectionSlug = keyof typeof DIRECTIONS;

// Цена доступа по направлению.
export const DIRECTION_PRICE: Record<DirectionSlug, number> = {
  risovanie: 990,
  "mentalnaya-arifmetika": 1490,
  "podgotovka-k-shkole": SUBSCRIPTION_PRICE,
};

/** Цена доступа к направлению в рублях. */
export function directionPrice(direction: DirectionSlug): number {
  return DIRECTION_PRICE[direction] ?? SUBSCRIPTION_PRICE;
}

export function isDirectionSlug(v: unknown): v is DirectionSlug {
  return typeof v === "string" && Object.prototype.hasOwnProperty.call(DIRECTIONS, v);
}

/** Слаг направления по пути возврата (returnTo). null — если путь не относится к направлению. */
export function directionFromReturnTo(returnTo: string): DirectionSlug | null {
  for (const [slug, meta] of Object.entries(DIRECTIONS)) {
    if (meta.path === returnTo) return slug as DirectionSlug;
  }
  return null;
}

export async function getAccessUntil(userId: string, direction: DirectionSlug): Promise<Date | null> {
  const access = await prisma.access.findUnique({
    where: { userId_direction: { userId, direction } },
    select: { until: true },
  });
  return access?.until ?? null;
}

export async function hasActiveAccess(userId: string, direction: DirectionSlug): Promise<boolean> {
  const until = await getAccessUntil(userId, direction);
  return Boolean(until && until.getTime() > Date.now());
}

/** Карта доступа по всем направлениям: { slug: Date|null }. Для кабинета. */
export async function getAccessMap(userId: string): Promise<Record<DirectionSlug, Date | null>> {
  const rows = await prisma.access.findMany({ where: { userId }, select: { direction: true, until: true } });
  const byDir = new Map(rows.map((r) => [r.direction, r.until]));
  const map = {} as Record<DirectionSlug, Date | null>;
  for (const slug of Object.keys(DIRECTIONS) as DirectionSlug[]) {
    map[slug] = byDir.get(slug) ?? null;
  }
  return map;
}

/**
 * Продлить доступ к направлению на N месяцев от текущей даты окончания
 * (или от сегодня, если истёк/не было). Upsert одной записи Access.
 */
export async function extendAccess(userId: string, direction: DirectionSlug, months: number): Promise<void> {
  const existing = await prisma.access.findUnique({
    where: { userId_direction: { userId, direction } },
    select: { until: true },
  });
  const now = Date.now();
  const base = existing?.until && existing.until.getTime() > now ? new Date(existing.until) : new Date();
  base.setMonth(base.getMonth() + Math.max(1, months));
  await prisma.access.upsert({
    where: { userId_direction: { userId, direction } },
    create: { userId, direction, until: base },
    update: { until: base },
  });
}
