import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export type DrawingArtworkStatus = "pending" | "approved" | "rejected";
export type DrawingArtworkWeek = "week-1" | "week-2" | "week-3" | "week-4" | "final";
export type DrawingArtworkAgeBand = "3-4" | "5-7" | "8-10";

export type DrawingArtwork = {
  id: string;
  child: string;
  city: string;
  title: string;
  week: DrawingArtworkWeek;
  ageBand: DrawingArtworkAgeBand;
  status: DrawingArtworkStatus;
  imageUrl: string;
  likes: number;
  createdAt: string;
  moderatedAt?: string;
};

export const ARTWORK_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "drawing-artworks");
const DATA_FILE = path.join(process.cwd(), "data", "drawing-artwork-submissions.json");
const ALLOWED_WEEKS = new Set<DrawingArtworkWeek>(["week-1", "week-2", "week-3", "week-4", "final"]);
const ALLOWED_AGE_BANDS = new Set<DrawingArtworkAgeBand>(["3-4", "5-7", "8-10"]);

export function normalizeWeek(value: FormDataEntryValue | string | null): DrawingArtworkWeek {
  const week = String(value ?? "week-1") as DrawingArtworkWeek;
  return ALLOWED_WEEKS.has(week) ? week : "week-1";
}

export function normalizeAgeBand(value: FormDataEntryValue | string | null): DrawingArtworkAgeBand {
  const ageBand = String(value ?? "3-4") as DrawingArtworkAgeBand;
  return ALLOWED_AGE_BANDS.has(ageBand) ? ageBand : "3-4";
}

export function weekLabel(week: DrawingArtworkWeek) {
  const labels: Record<DrawingArtworkWeek, string> = {
    "week-1": "Итоги недели 1",
    "week-2": "Итоги недели 2",
    "week-3": "Итоги недели 3",
    "week-4": "Итоги недели 4",
    final: "Финальный рисунок месяца",
  };
  return labels[week];
}

export async function readDrawingArtworks(): Promise<DrawingArtwork[]> {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

async function writeDrawingArtworks(items: DrawingArtwork[]) {
  await mkdir(path.dirname(DATA_FILE), { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(items, null, 2));
}

export async function createDrawingArtwork(input: {
  child: string;
  city: string;
  title: string;
  week: DrawingArtworkWeek;
  ageBand: DrawingArtworkAgeBand;
  extension: string;
  buffer: Buffer;
}) {
  await mkdir(ARTWORK_UPLOAD_DIR, { recursive: true });

  const id = randomUUID();
  const fileName = `${new Date().toISOString().slice(0, 10)}-${input.week}-${id}.${input.extension}`;
  const filePath = path.join(ARTWORK_UPLOAD_DIR, fileName);
  await writeFile(filePath, input.buffer);

  const record: DrawingArtwork = {
    id,
    child: input.child,
    city: input.city,
    title: input.title,
    week: input.week,
    ageBand: input.ageBand,
    status: "pending",
    imageUrl: `/uploads/drawing-artworks/${fileName}`,
    likes: 0,
    createdAt: new Date().toISOString(),
  };

  const queue = await readDrawingArtworks();
  await writeDrawingArtworks([record, ...queue].slice(0, 500));
  return record;
}

export async function setDrawingArtworkStatus(id: string, status: DrawingArtworkStatus) {
  const items = await readDrawingArtworks();
  const next = items.map((item) =>
    item.id === id ? { ...item, status, moderatedAt: new Date().toISOString() } : item,
  );
  await writeDrawingArtworks(next);
}

export async function likeDrawingArtwork(id: string) {
  const items = await readDrawingArtworks();
  let updated: DrawingArtwork | undefined;
  const next = items.map((item) => {
    if (item.id !== id || item.status !== "approved") return item;
    updated = { ...item, likes: item.likes + 1 };
    return updated;
  });
  await writeDrawingArtworks(next);
  return updated;
}

export function approvedSorted(items: DrawingArtwork[], week?: DrawingArtworkWeek) {
  return items
    .filter((item) => item.status === "approved" && (!week || item.week === week))
    .sort((a, b) => b.likes - a.likes || Date.parse(b.createdAt) - Date.parse(a.createdAt));
}
