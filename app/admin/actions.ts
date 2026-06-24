"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { setAuthDisabled } from "@/lib/settings";

export async function toggleAuth(formData: FormData) {
  const session = await getAdminSession();
  if (!session) return; // только админ

  const disabled = formData.get("disabled") === "true";
  await setAuthDisabled(disabled);

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/login");
}
