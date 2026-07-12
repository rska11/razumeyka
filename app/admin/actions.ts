"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { setAuthDisabled } from "@/lib/settings";
import { DIRECTIONS, type DirectionSlug } from "@/lib/subscription";

export async function toggleAuth(formData: FormData) {
  const session = await getAdminSession();
  if (!session) return; // только админ

  const disabled = formData.get("disabled") === "true";
  await setAuthDisabled(disabled);

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/login");
}

function revalidateAccessPages() {
  revalidatePath("/admin");
  revalidatePath("/risovanie");
  revalidatePath("/mentalnaya-arifmetika");
  revalidatePath("/cabinet");
}

/** Разблокировать все уроки ТОЛЬКО себе (текущему админу) — для проверки. Доступ на год по всем направлениям. */
export async function unlockAllForMe() {
  const session = await getAdminSession();
  if (!session?.user?.id) return; // только админ, только себе
  const until = new Date();
  until.setFullYear(until.getFullYear() + 1);
  for (const direction of Object.keys(DIRECTIONS) as DirectionSlug[]) {
    await prisma.access.upsert({
      where: { userId_direction: { userId: session.user.id, direction } },
      create: { userId: session.user.id, direction, until },
      update: { until },
    });
  }
  revalidateAccessPages();
}

/** Снять тестовый доступ у себя (вернуть freemium-замки). */
export async function lockAllForMe() {
  const session = await getAdminSession();
  if (!session?.user?.id) return;
  await prisma.access.deleteMany({ where: { userId: session.user.id } });
  revalidateAccessPages();
}
