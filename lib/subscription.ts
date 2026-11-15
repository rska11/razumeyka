import { prisma } from "@/lib/prisma";

// Доступ к self-study библиотеке — РАЗДЕЛЬНО ПО НАПРАВЛЕНИЯМ.
// Оплата открывает конкретное направление либо пакет «Все направления» (BUNDLE_SLUG).
// Пилот: оплаченный период доступа без автосписания (продлевается вручную/новой оплатой).

export const SUBSCRIPTION_PRICE = 490; // ₽ за период (по умолчанию)
export const SUBSCRIPTION_MONTHS = 1;
export const SCHOOL_PREP_ACCESS_DAYS = 45;

// Направления, которые продаются как self-study доступ.
export const DIRECTIONS = {
  risovanie: { path: "/risovanie", title: "Рисование" },
  "mentalnaya-arifmetika": { path: "/mentalnaya-arifmetika", title: "Ментальная арифметика" },
  "podgotovka-k-shkole": { path: "/podgotovka-k-shkole", title: "Подготовка к школе" },
} as const;

export type DirectionSlug = keyof typeof DIRECTIONS;

// Цена доступа по направлению.
export const DIRECTION_PRICE: Record<DirectionSlug, number> = {
  risovanie: SUBSCRIPTION_PRICE,
  "mentalnaya-arifmetika": SUBSCRIPTION_PRICE,
  "podgotovka-k-shkole": 390,
};

/** Цена доступа к направлению в рублях. */
export function directionPrice(direction: DirectionSlug): number {
  return DIRECTION_PRICE[direction] ?? SUBSCRIPTION_PRICE;
}

export function directionAccessLabel(direction: DirectionSlug): string {
  return direction === "podgotovka-k-shkole" ? `${SCHOOL_PREP_ACCESS_DAYS} дней` : `${SUBSCRIPTION_MONTHS} мес`;
}

export function isDirectionSlug(v: unknown): v is DirectionSlug {
  return typeof v === "string" && Object.prototype.hasOwnProperty.call(DIRECTIONS, v);
}

// ── Пакет «Все направления» ────────────────────────────────────────────────
// Одна оплата продлевает доступ сразу ко всем направлениям из DIRECTIONS
// (каждое — на свой обычный период: 1 мес, подготовка к школе — 45 дней).
// В Payment хранится directionSlug = BUNDLE_SLUG.
export const BUNDLE_SLUG = "vse-napravleniya";
export const BUNDLE_TITLE = "Все направления";
export const BUNDLE_PRICE = 990;

export type PurchaseSlug = DirectionSlug | typeof BUNDLE_SLUG;

export const ALL_DIRECTION_SLUGS = Object.keys(DIRECTIONS) as DirectionSlug[];

/** Сумма цен всех направлений по отдельности — для показа выгоды пакета. */
export function bundleFullPrice(): number {
  return ALL_DIRECTION_SLUGS.reduce((sum, slug) => sum + directionPrice(slug), 0);
}

/** Выгода пакета в рублях и процентах (округление вниз, чтобы не завышать). */
export function bundleSavings(): { rub: number; percent: number } {
  const full = bundleFullPrice();
  const rub = Math.max(0, full - BUNDLE_PRICE);
  return { rub, percent: full > 0 ? Math.floor((rub / full) * 100) : 0 };
}

export function isBundleSlug(v: unknown): v is typeof BUNDLE_SLUG {
  return v === BUNDLE_SLUG;
}

export function isPurchaseSlug(v: unknown): v is PurchaseSlug {
  return isDirectionSlug(v) || isBundleSlug(v);
}

export function purchasePrice(slug: PurchaseSlug): number {
  return isBundleSlug(slug) ? BUNDLE_PRICE : directionPrice(slug);
}

export function purchaseTitle(slug: PurchaseSlug): string {
  return isBundleSlug(slug) ? BUNDLE_TITLE : DIRECTIONS[slug].title;
}

export function purchaseAccessLabel(slug: PurchaseSlug): string {
  return isBundleSlug(slug)
    ? `${SUBSCRIPTION_MONTHS} мес, подготовка к школе — ${SCHOOL_PREP_ACCESS_DAYS} дней`
    : directionAccessLabel(slug);
}

/** Куда вести после оплаты / в «К урокам». */
export function purchasePath(slug: PurchaseSlug): string {
  return isBundleSlug(slug) ? "/cabinet" : DIRECTIONS[slug].path;
}

/**
 * Применить оплаченный платёж-подписку: продлить доступ к направлению или ко всем
 * направлениям пакета. Вызывается ОДИН раз на платёж (идемпотентность — на стороне
 * вызывающего: переход статуса pending → paid).
 */
export async function applyPaidSubscription(payment: {
  userId: string;
  directionSlug: string | null;
  periodMonths: number | null;
}): Promise<void> {
  const months = payment.periodMonths ?? 1;
  if (isBundleSlug(payment.directionSlug)) {
    for (const slug of ALL_DIRECTION_SLUGS) {
      await extendAccess(payment.userId, slug, months);
    }
    return;
  }
  if (isDirectionSlug(payment.directionSlug)) {
    await extendAccess(payment.userId, payment.directionSlug, months);
  }
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
  const periods = Math.max(1, months);
  if (direction === "podgotovka-k-shkole") {
    base.setDate(base.getDate() + SCHOOL_PREP_ACCESS_DAYS * periods);
  } else {
    base.setMonth(base.getMonth() + periods);
  }
  await prisma.access.upsert({
    where: { userId_direction: { userId, direction } },
    create: { userId, direction, until: base },
    update: { until: base },
  });
}
