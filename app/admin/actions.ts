"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { setAuthDisabled } from "@/lib/settings";
import { DIRECTIONS, extendAccess, isDirectionSlug, type DirectionSlug } from "@/lib/subscription";

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

/** Выдать/продлить доступ пользователю к направлению на N месяцев (ручная выдача админом). */
export async function grantAccessToUser(formData: FormData) {
  const session = await getAdminSession();
  if (!session) return; // только админ

  const userId = String(formData.get("userId") ?? "");
  const direction = String(formData.get("direction") ?? "");
  const months = Math.max(1, Math.min(12, Number(formData.get("months")) || 1));
  if (!userId || !isDirectionSlug(direction)) return;

  await extendAccess(userId, direction, months);
  revalidateAccessPages();
}

/** Отозвать доступ пользователя к направлению (удалить запись Access). */
export async function revokeAccessFromUser(formData: FormData) {
  const session = await getAdminSession();
  if (!session) return; // только админ

  const userId = String(formData.get("userId") ?? "");
  const direction = String(formData.get("direction") ?? "");
  if (!userId || !isDirectionSlug(direction)) return;

  await prisma.access.deleteMany({ where: { userId, direction } });
  revalidateAccessPages();
}
