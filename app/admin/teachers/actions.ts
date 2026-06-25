"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("FORBIDDEN");
}

export async function addTeacher(formData: FormData) {
  await requireAdmin();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim().slice(0, 80);
  if (!EMAIL_RE.test(email)) return;

  // Заводим/обновляем пользователя как преподавателя (войдёт по email-коду)
  await prisma.user.upsert({
    where: { email },
    update: { role: "teacher", isBlocked: false, name: name || undefined },
    create: { email, name: name || null, role: "teacher", provider: "staff" },
  });

  revalidatePath("/admin/teachers");
  revalidatePath("/admin/lessons");
}

export async function toggleTeacherBlocked(formData: FormData) {
  await requireAdmin();
  const teacherId = String(formData.get("teacherId") ?? "");
  const block = formData.get("block") === "true";
  if (!teacherId) return;
  await prisma.user.update({ where: { id: teacherId }, data: { isBlocked: block } });
  revalidatePath("/admin/teachers");
}

export async function assignTeacher(formData: FormData) {
  await requireAdmin();
  const enrollmentId = String(formData.get("enrollmentId") ?? "");
  const teacherId = String(formData.get("teacherId") ?? "");
  if (!enrollmentId) return;
  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { teacherId: teacherId || null },
  });
  revalidatePath("/admin/lessons");
  revalidatePath("/teacher");
}
