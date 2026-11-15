import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import {
  getAllCourseProgress,
  getDirectionProgress,
  isDirectionSlug,
  syncDirectionProgress,
} from "@/lib/course-progress";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  const direction = new URL(req.url).searchParams.get("direction");
  if (direction) {
    if (!isDirectionSlug(direction)) {
      return NextResponse.json({ error: "INVALID_DIRECTION" }, { status: 400 });
    }
    const progress = await getDirectionProgress(session.user.id, direction);
    return NextResponse.json({ authenticated: true, progress });
  }

  const all = await getAllCourseProgress(session.user.id);
  return NextResponse.json({ authenticated: true, progressByDirection: all });
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  let body: { direction?: unknown; completedItems?: unknown; meta?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
  }

  if (!isDirectionSlug(body.direction)) {
    return NextResponse.json({ error: "INVALID_DIRECTION" }, { status: 400 });
  }

  const res = await syncDirectionProgress({
    userId: session.user.id,
    direction: body.direction,
    completedItems: body.completedItems,
    meta: body.meta,
  });

  return NextResponse.json({ ok: true, ...res });
}
