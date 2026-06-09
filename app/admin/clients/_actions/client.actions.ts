"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, updateClient } from "@/lib/data/clients";
import { clientSchema } from "@/lib/schemas/client.schema";
import { isDevMode } from "@/lib/dev/config";

export async function createClientAction(formData: FormData) {
  if (!isDevMode()) {
    throw new Error("Client creation requires dev mode or a connected backend.");
  }

  const raw = Object.fromEntries(formData);
  const parsed = clientSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  await createClient(parsed.data);
  revalidatePath("/admin/clients");
  redirect("/admin/clients");
}

export async function updateClientAction(id: string, formData: FormData) {
  if (!isDevMode()) {
    throw new Error("Client updates require dev mode or a connected backend.");
  }

  const raw = Object.fromEntries(formData);
  const parsed = clientSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  await updateClient(id, parsed.data);
  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${id}`);
  redirect(`/admin/clients/${id}`);
}
