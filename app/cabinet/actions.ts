"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { directionsData } from "@/data/directions.js";

async function requireUserId(): Promise<string> {
  const session = await getAuthSession();
  const id = session?.user?.id;
  if (!id) throw new Error("UNAUTHORIZED");
  return id;
}

const AVATAR_COLORS = ["bg-brand-blue", "bg-brand-pink", "bg-brand-orange", "bg-brand-green", "bg-brand-purple"];

export async function addChild(formData: FormData) {
  const userId = await requireUserId();
  const name = String(formData.get("name") ?? "").trim();
  const birthYearRaw = String(formData.get("birthYear") ?? "").trim();
  const birthYear = birthYearRaw ? Number.parseInt(birthYearRaw, 10) : null;
  if (!name) return;

  const count = await prisma.child.count({ where: { parentId: userId } });

  await prisma.child.create({
    data: {
      parentId: userId,
      name,
      birthYear: Number.isFinite(birthYear as number) ? birthYear : null,
      avatarColor: AVATAR_COLORS[count % AVATAR_COLORS.length],
    },
  });

  revalidatePath("/cabinet");
  revalidatePath("/cabinet/children");
}

export async function deleteChild(formData: FormData) {
  const userId = await requireUserId();
  const childId = String(formData.get("childId") ?? "");
  if (!childId) return;

  // Удаляем только своего ребёнка
  await prisma.child.deleteMany({ where: { id: childId, parentId: userId } });

  revalidatePath("/cabinet");
  revalidatePath("/cabinet/children");
}

export async function addEnrollment(formData: FormData) {
  const userId = await requireUserId();
  const childId = String(formData.get("childId") ?? "");
  const slug = String(formData.get("directionSlug") ?? "");
  const format = String(formData.get("format") ?? "collective");
  const tariff = String(formData.get("tariff") ?? "1m");
  if (!childId || !slug) return;

  // Проверяем, что ребёнок принадлежит этому родителю
  const child = await prisma.child.findFirst({ where: { id: childId, parentId: userId } });
  if (!child) return;

  const direction = directionsData.find((d: { slug: string }) => d.slug === slug);
  if (!direction) return;

  await prisma.enrollment.create({
    data: {
      childId,
      directionSlug: slug,
      directionTitle: direction.title,
      format: format === "individual" ? "individual" : "collective",
      tariff,
      status: "pending",
      progress: 0,
    },
  });

  revalidatePath("/cabinet");
  revalidatePath("/cabinet/children");
}

export async function removeEnrollment(formData: FormData) {
  const userId = await requireUserId();
  const enrollmentId = String(formData.get("enrollmentId") ?? "");
  if (!enrollmentId) return;

  // Удаляем запись только если её ребёнок принадлежит этому родителю
  const enrollment = await prisma.enrollment.findFirst({
    where: { id: enrollmentId, child: { parentId: userId } },
  });
  if (!enrollment) return;

  await prisma.enrollment.delete({ where: { id: enrollmentId } });

  revalidatePath("/cabinet");
  revalidatePath("/cabinet/children");
}
