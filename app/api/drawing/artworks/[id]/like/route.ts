import { NextResponse } from "next/server";
import { likeDrawingArtwork } from "@/lib/drawing-artworks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const artwork = await likeDrawingArtwork(id);

  if (!artwork) {
    return NextResponse.json({ error: "Работа не найдена или ещё не опубликована." }, { status: 404 });
  }

  return NextResponse.json({ artwork });
}
