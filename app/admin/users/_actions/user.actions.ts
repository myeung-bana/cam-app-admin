"use server";

import { revalidatePath } from "next/cache";
import { redirectWithSuccessFlash } from "@/lib/flash/redirect-with-success";
import { createAdminUser, updateAdminUser } from "@/lib/data/admin-users";
import {
  adminUserSchema,
  createAdminUserSchema,
} from "@/lib/schemas/admin-user.schema";

export async function createAdminUserAction(formData: FormData) {
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
  redirectWithSuccessFlash(`/admin/users/${user.id}`, "adminUserCreated");
}

export async function updateAdminUserAction(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = adminUserSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  await updateAdminUser(id, parsed.data);
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}`);
}
