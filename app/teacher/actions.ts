"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getTeacherSession } from "@/lib/auth";

async function ownsEnrollment(enrollmentId: string, teacherId: string) {
  if (!enrollmentId) return false;
  const e = await prisma.enrollment.findFirst({ where: { id: enrollmentId, teacherId } });
  return !!e;
}

export async function teacherSetZoom(formData: FormData) {
  const s = await getTeacherSession();
  if (!s) return;
  const enrollmentId = String(formData.get("enrollmentId") ?? "");
  const zoomUrl = String(formData.get("zoomUrl") ?? "").trim();
  if (!(await ownsEnrollment(enrollmentId, s.user.id))) return;
  await prisma.enrollment.update({ where: { id: enrollmentId }, data: { zoomUrl: zoomUrl || null } });
  revalidatePath("/teacher");
  revalidatePath("/cabinet/schedule");
}

export async function teacherAddLesson(formData: FormData) {
  const s = await getTeacherSession();
  if (!s) return;
  const enrollmentId = String(formData.get("enrollmentId") ?? "");
  const startsAtRaw = String(formData.get("startsAt") ?? "").trim();
  const topic = String(formData.get("topic") ?? "").trim().slice(0, 120);
  if (!startsAtRaw || !(await ownsEnrollment(enrollmentId, s.user.id))) return;

  const startsAt = new Date(startsAtRaw);
  if (Number.isNaN(startsAt.getTime())) return;

  await prisma.lesson.create({
    data: { enrollmentId, startsAt, topic: topic || null, status: "scheduled" },
  });
  revalidatePath("/teacher");
  revalidatePath("/cabinet/schedule");
  revalidatePath("/cabinet");
}

export async function teacherDeleteLesson(formData: FormData) {
  const s = await getTeacherSession();
  if (!s) return;
  const lessonId = String(formData.get("lessonId") ?? "");
  if (!lessonId) return;
  // удаляем только если занятие относится к записи этого преподавателя
  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, enrollment: { teacherId: s.user.id } },
  });
  if (!lesson) return;
  await prisma.lesson.delete({ where: { id: lessonId } });
  revalidatePath("/teacher");
  revalidatePath("/cabinet/schedule");
}
