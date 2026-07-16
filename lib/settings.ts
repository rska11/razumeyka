import { prisma } from "@/lib/prisma";

const AUTH_DISABLED_KEY = "authDisabledV2";

/** Выключена ли авторизация глобально (рубильник из админки). */
export async function isAuthDisabled(): Promise<boolean> {
  try {
    const s = await prisma.systemSetting.findUnique({ where: { key: AUTH_DISABLED_KEY } });
    return s?.value === "true";
  } catch {
    return false; // при сбое БД не блокируем
  }
}

export async function setAuthDisabled(disabled: boolean): Promise<void> {
  const value = disabled ? "true" : "false";
  await prisma.systemSetting.upsert({
    where: { key: AUTH_DISABLED_KEY },
    update: { value },
    create: { key: AUTH_DISABLED_KEY, value },
  });
}
