import { NextResponse } from "next/server";
import {
  approvedSorted,
  createDrawingArtwork,
  normalizeAgeBand,
  normalizeWeek,
  readDrawingArtworks,
} from "@/lib/drawing-artworks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

function cleanText(value: FormDataEntryValue | null, fallback = "") {
  return String(value ?? fallback).trim().slice(0, 80);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const weekParam = url.searchParams.get("week");
  const week = weekParam ? normalizeWeek(weekParam) : undefined;
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 30), 100);
  const artworks = approvedSorted(await readDrawingArtworks(), week).slice(0, limit);

  return NextResponse.json({ artworks });
}

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("artwork");
  const child = cleanText(form.get("child"));
  const city = cleanText(form.get("city"));
  const title = cleanText(form.get("title"));
  const week = normalizeWeek(form.get("week"));
  const ageBand = normalizeAgeBand(form.get("ageBand"));

  if (!child || !city || !title) {
    return NextResponse.json({ error: "Заполните имя, город и название работы." }, { status: 400 });
  }

  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Загрузите изображение работы." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Файл слишком большой. Максимум 8 МБ." }, { status: 400 });
  }

  const extension = ALLOWED_TYPES.get(file.type);
  if (!extension) {
    return NextResponse.json({ error: "Поддерживаются JPG, PNG и WebP." }, { status: 400 });
  }

  const artwork = await createDrawingArtwork({
    child,
    city,
    title,
    week,
    ageBand,
    extension,
    buffer: Buffer.from(await file.arrayBuffer()),
  });

  return NextResponse.json({ artwork });
}
