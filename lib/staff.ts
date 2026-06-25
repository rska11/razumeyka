import { prisma } from "@/lib/prisma";

/** Является ли email действующим преподавателем (role=teacher, не заблокирован). */
export async function isTeacherEmail(email?: string | null): Promise<boolean> {
  const e = String(email ?? "").trim().toLowerCase();
  if (!e) return false;
  try {
    const u = await prisma.user.findUnique({
      where: { email: e },
      select: { role: true, isBlocked: true },
    });
    return !!u && u.role === "teacher" && !u.isBlocked;
  } catch {
    return false;
  }
}
