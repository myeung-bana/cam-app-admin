"use server";

import { revalidatePath } from "next/cache";
import { redirectWithSuccessFlash } from "@/lib/flash/redirect-with-success";
import {
  createClient,
  updateClient,
  archiveClient,
  resendClientInvite,
} from "@/lib/data/clients";
import { clientSchema } from "@/lib/schemas/client.schema";
import { isDevMode } from "@/lib/dev/config";
import { logActivity } from "@/lib/dev/store";

export async function createClientAction(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = clientSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  await createClient(parsed.data);
  revalidatePath("/admin/clients");
  redirectWithSuccessFlash("/admin/clients", "clientCreated");
}

export async function updateClientAction(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = clientSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  await updateClient(id, parsed.data);
  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${id}`);
  redirectWithSuccessFlash(`/admin/clients/${id}`, "clientUpdated");
}

export async function archiveClientAction(id: string) {
  await archiveClient(id);
  revalidatePath("/admin/clients");
  redirectWithSuccessFlash("/admin/clients", "clientArchived");
}

export async function resendPortalInviteAction(clientId: string) {
  if (isDevMode()) {
    logActivity("portal_invite", "Portal invitation resent", clientId);
  } else {
    await resendClientInvite(clientId);
  }
  revalidatePath(`/admin/clients/${clientId}`);
}
