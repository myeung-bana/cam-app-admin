"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminUser, updateAdminUser } from "@/lib/data/admin-users";
import {
  adminUserSchema,
  createAdminUserSchema,
} from "@/lib/schemas/admin-user.schema";
import { isDevMode } from "@/lib/dev/config";

export async function createAdminUserAction(formData: FormData) {
  if (!isDevMode()) {
    throw new Error("User creation requires dev mode or a connected backend.");
  }

  const raw = Object.fromEntries(formData);
  const parsed = createAdminUserSchema.safeParse({
    ...raw,
    role: raw.role || "admin",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const user = await createAdminUser(parsed.data);
  revalidatePath("/admin/users");
  redirect(`/admin/users/${user.id}`);
}

export async function updateAdminUserAction(id: string, formData: FormData) {
  if (!isDevMode()) {
    throw new Error("User updates require dev mode or a connected backend.");
  }

  const raw = Object.fromEntries(formData);
  const parsed = adminUserSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  await updateAdminUser(id, parsed.data);
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}`);
}
