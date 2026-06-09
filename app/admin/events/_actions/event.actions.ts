"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createEvent } from "@/lib/data/events";
import { eventSchema } from "@/lib/schemas/event.schema";
import { isDevMode } from "@/lib/dev/config";

export async function createEventAction(formData: FormData) {
  if (!isDevMode()) {
    throw new Error("Event creation requires dev mode or a connected backend.");
  }

  const raw = Object.fromEntries(formData);
  const parsed = eventSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const event = await createEvent(parsed.data);
  revalidatePath("/admin/events");
  redirect(`/admin/events/${event.id}`);
}
