"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { setDrawingArtworkStatus } from "@/lib/drawing-artworks";

export async function moderateDrawingArtwork(formData: FormData) {
  const session = await getAdminSession();
  if (!session) return;

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || (status !== "approved" && status !== "rejected")) return;

  await setDrawingArtworkStatus(id, status);
  revalidatePath("/admin/drawing-artworks");
  revalidatePath("/risovanie");
}
