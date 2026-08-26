import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_PAYLOAD_LENGTH = 180_000;

async function ownedChild(userId: string, childId: string) {
  return prisma.child.findFirst({ where: { id: childId, parentId: userId }, select: { id: true } });
}

export async function GET(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const childId = new URL(req.url).searchParams.get("childId") || "";
  if (!childId || !(await ownedChild(session.user.id, childId))) {
    return NextResponse.json({ error: "CHILD_NOT_FOUND" }, { status: 404 });
  }

  const row = await prisma.multiplicationProgress.findUnique({
    where: { childId },
    select: { payload: true, updatedAt: true },
  });
  if (!row) return NextResponse.json({ progress: null, updatedAt: null });

  try {
    return NextResponse.json({ progress: JSON.parse(row.payload), updatedAt: row.updatedAt.getTime() });
  } catch {
    return NextResponse.json({ progress: null, updatedAt: row.updatedAt.getTime() });
  }
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  let body: { childId?: unknown; progress?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
  }

  const childId = typeof body.childId === "string" ? body.childId : "";
  if (!childId || !(await ownedChild(session.user.id, childId))) {
    return NextResponse.json({ error: "CHILD_NOT_FOUND" }, { status: 404 });
  }
  if (!body.progress || typeof body.progress !== "object" || Array.isArray(body.progress)) {
    return NextResponse.json({ error: "INVALID_PROGRESS" }, { status: 400 });
  }

  const payload = JSON.stringify(body.progress);
  if (payload.length > MAX_PAYLOAD_LENGTH) {
    return NextResponse.json({ error: "PAYLOAD_TOO_LARGE" }, { status: 413 });
  }

  const row = await prisma.multiplicationProgress.upsert({
    where: { childId },
    create: { childId, payload },
    update: { payload },
    select: { updatedAt: true },
  });
  return NextResponse.json({ ok: true, updatedAt: row.updatedAt.getTime() });
}
