import { prisma } from "@/lib/prisma";
import { ALL_DIRECTION_SLUGS, DIRECTIONS, isDirectionSlug, type DirectionSlug } from "@/lib/subscription";

const MAX_ITEMS = 2500;
const MAX_ITEM_LEN = 120;
const MAX_META_LEN = 8000;

export interface CourseMilestone {
  threshold: number;
  title: string;
  icon: string;
}

export const COURSE_MILESTONES: Record<DirectionSlug, CourseMilestone[]> = {
  risovanie: [
    { threshold: 1, title: "Первый рисунок в мастерской", icon: "🎨" },
    { threshold: 5, title: "5 уроков рисования позади", icon: "🖌️" },
    { threshold: 15, title: "Юный художник · 15 работ", icon: "🌟" },
    { threshold: 30, title: "30 уроков рисования!", icon: "🏆" },
  ],
  "mentalnaya-arifmetika": [
    { threshold: 1, title: "Первый шаг на абакусе", icon: "🧮" },
    { threshold: 5, title: "5 тренировок счёта", icon: "⚡" },
    { threshold: 15, title: "Быстрый ум · 15 уроков", icon: "🚀" },
    { threshold: 30, title: "Мастер счёта · 30 уроков", icon: "🏆" },
  ],
  "podgotovka-k-shkole": [
    { threshold: 1, title: "Старт экспедиции к школе", icon: "🎒" },
    { threshold: 8, title: "Первый день экспедиции пройден", icon: "🧭" },
    { threshold: 25, title: "25 школьных миссий выполнено", icon: "🌟" },
    { threshold: 60, title: "Готов к школе · 60 миссий!", icon: "🎓" },
  ],
};

function sanitizeItems(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const v of raw) {
    if (typeof v !== "string") continue;
    const s = v.trim().slice(0, MAX_ITEM_LEN);
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
    if (out.length >= MAX_ITEMS) break;
  }
  return out;
}

function parseStoredItems(json: string | null | undefined): string[] {
  if (!json) return [];
  try {
    return sanitizeItems(JSON.parse(json));
  } catch {
    return [];
  }
}

function sanitizeMeta(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  try {
    const s = JSON.stringify(raw);
    if (s.length > MAX_META_LEN) return {};
    return JSON.parse(s) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export interface DirectionProgressView {
  direction: DirectionSlug;
  title: string;
  path: string;
  completedItems: string[];
  completedCount: number;
  meta: Record<string, unknown>;
  lastActivityAt: Date | null;
}

export async function getDirectionProgress(
  userId: string,
  direction: DirectionSlug,
): Promise<DirectionProgressView> {
  const row = await prisma.courseProgress.findUnique({
    where: { userId_direction: { userId, direction } },
  });
  const items = parseStoredItems(row?.completedItems);
  return {
    direction,
    title: DIRECTIONS[direction].title,
    path: DIRECTIONS[direction].path,
    completedItems: items,
    completedCount: items.length,
    meta: row?.meta ? sanitizeMeta( safeJson(row.meta) ) : {},
    lastActivityAt: row?.lastActivityAt ?? null,
  };
}

function safeJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}

export async function getAllCourseProgress(
  userId: string,
): Promise<Record<DirectionSlug, DirectionProgressView>> {
  const rows = await prisma.courseProgress.findMany({ where: { userId } });
  const byDir = new Map(rows.map((r) => [r.direction, r]));
  const out = {} as Record<DirectionSlug, DirectionProgressView>;
  for (const slug of ALL_DIRECTION_SLUGS) {
    const r = byDir.get(slug);
    const items = parseStoredItems(r?.completedItems);
    out[slug] = {
      direction: slug,
      title: DIRECTIONS[slug].title,
      path: DIRECTIONS[slug].path,
      completedItems: items,
      completedCount: items.length,
      meta: r?.meta ? sanitizeMeta(safeJson(r.meta)) : {},
      lastActivityAt: r?.lastActivityAt ?? null,
    };
  }
  return out;
}

/**
 * Слить присланный прогресс с сохранённым (объединение множеств completedItems,
 * чтобы с разных устройств ничего не терялось) и выдать недостающие награды
 * первому профилю ребёнка в семье (если он создан).
 */
export async function syncDirectionProgress(params: {
  userId: string;
  direction: DirectionSlug;
  completedItems?: unknown;
  meta?: unknown;
}): Promise<{ completedItems: string[]; completedCount: number; newAchievements: string[] }> {
  const { userId, direction } = params;
  const existing = await prisma.courseProgress.findUnique({
    where: { userId_direction: { userId, direction } },
  });

  const prevItems = parseStoredItems(existing?.completedItems);
  const incoming = sanitizeItems(params.completedItems);
  const merged = sanitizeItems([...prevItems, ...incoming]);

  const prevMeta = existing?.meta ? sanitizeMeta(safeJson(existing.meta)) : {};
  const nextMeta = { ...prevMeta, ...sanitizeMeta(params.meta) };

  const countChanged = merged.length !== prevItems.length;
  const now = new Date();

  await prisma.courseProgress.upsert({
    where: { userId_direction: { userId, direction } },
    create: {
      userId,
      direction,
      completedItems: JSON.stringify(merged),
      completedCount: merged.length,
      meta: JSON.stringify(nextMeta),
      lastActivityAt: now,
    },
    update: {
      completedItems: JSON.stringify(merged),
      completedCount: merged.length,
      meta: JSON.stringify(nextMeta),
      ...(countChanged ? { lastActivityAt: now } : {}),
    },
  });

  const newAchievements = await awardCourseMilestones(userId, direction, merged.length);
  return { completedItems: merged, completedCount: merged.length, newAchievements };
}

async function awardCourseMilestones(
  userId: string,
  direction: DirectionSlug,
  completedCount: number,
): Promise<string[]> {
  const milestones = COURSE_MILESTONES[direction]?.filter((m) => completedCount >= m.threshold) ?? [];
  if (milestones.length === 0) return [];

  const child = await prisma.child.findFirst({
    where: { parentId: userId },
    orderBy: { createdAt: "asc" },
    select: { id: true, achievements: { select: { title: true } } },
  });
  if (!child) return [];

  const have = new Set(child.achievements.map((a) => a.title));
  const earned: string[] = [];
  for (const m of milestones) {
    if (have.has(m.title)) continue;
    await prisma.achievement.create({
      data: { childId: child.id, title: m.title, icon: m.icon },
    });
    earned.push(m.title);
  }
  return earned;
}

export { isDirectionSlug };
