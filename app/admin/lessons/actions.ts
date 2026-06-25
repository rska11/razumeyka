"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("FORBIDDEN");
}

export async function setZoom(formData: FormData) {
  await requireAdmin();
  const enrollmentId = String(formData.get("enrollmentId") ?? "");
  const zoomUrl = String(formData.get("zoomUrl") ?? "").trim();
  if (!enrollmentId) return;
  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { zoomUrl: zoomUrl || null },
  });
  revalidatePath("/admin/lessons");
}

export async function addLesson(formData: FormData) {
  await requireAdmin();
  const enrollmentId = String(formData.get("enrollmentId") ?? "");
  const startsAtRaw = String(formData.get("startsAt") ?? "").trim(); // datetime-local: "2026-06-26T18:30"
  const topic = String(formData.get("topic") ?? "").trim().slice(0, 120);
  const joinUrl = String(formData.get("joinUrl") ?? "").trim();
  if (!enrollmentId || !startsAtRaw) return;

  const startsAt = new Date(startsAtRaw);
  if (Number.isNaN(startsAt.getTime())) return;

  await prisma.lesson.create({
    data: {
      enrollmentId,
      startsAt,
      topic: topic || null,
      joinUrl: joinUrl || null,
      status: "scheduled",
    },
  });
  revalidatePath("/admin/lessons");
  revalidatePath("/cabinet/schedule");
  revalidatePath("/cabinet");
}

export async function deleteLesson(formData: FormData) {
  await requireAdmin();
  const lessonId = String(formData.get("lessonId") ?? "");
  if (!lessonId) return;
  await prisma.lesson.delete({ where: { id: lessonId } });
  revalidatePath("/admin/lessons");
  revalidatePath("/cabinet/schedule");
}
