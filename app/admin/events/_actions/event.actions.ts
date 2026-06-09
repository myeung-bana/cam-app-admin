"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createEvent,
  updateEvent,
  transitionEventStatus,
} from "@/lib/data/events";
import { eventSchema } from "@/lib/schemas/event.schema";
import { isDevMode } from "@/lib/dev/config";
import { logActivity } from "@/lib/dev/store";
import type { EventStatus } from "@/lib/types";

function revalidateEvent(eventId: string) {
  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${eventId}`);
  revalidatePath(`/admin/events/${eventId}/live`);
  revalidatePath(`/admin/events/${eventId}/media`);
  revalidatePath(`/admin/events/${eventId}/challenges`);
  revalidatePath(`/admin/events/${eventId}/reel`);
  revalidatePath(`/admin/events/${eventId}/portal`);
}

export async function createEventAction(formData: FormData) {
  if (!isDevMode()) {
    throw new Error("Event creation requires dev mode or a connected backend.");
  }

  const raw = Object.fromEntries(formData);
  const parsed = eventSchema.safeParse(raw);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const event = await createEvent({
    ...parsed.data,
    start_time: new Date(parsed.data.start_time).toISOString(),
    end_time: new Date(parsed.data.end_time).toISOString(),
  });
  revalidatePath("/admin/events");
  redirect(`/admin/events/${event.id}`);
}

export async function transitionEventStatusAction(
  eventId: string,
  status: EventStatus
) {
  if (!isDevMode()) throw new Error("Status transitions require dev mode.");
  await transitionEventStatus(eventId, status);
  revalidateEvent(eventId);
}

export async function adjustEventCapAction(eventId: string, cap: number) {
  if (!isDevMode()) throw new Error("Cap adjustment requires dev mode.");
  if (cap < 1) throw new Error("Cap must be at least 1");
  await updateEvent(eventId, { max_attendees: cap });
  logActivity("cap_adjusted", `Attendee cap set to ${cap}`, eventId);
  revalidateEvent(eventId);
}

export async function regenerateQrAction(eventId: string) {
  if (!isDevMode()) throw new Error("QR regeneration requires dev mode.");
  const token = `qr-${Date.now()}`;
  await updateEvent(eventId, {
    qr_token: token,
    qr_image_url: `/api/events/${eventId}/qr?t=${Date.now()}`,
  });
  logActivity("qr_regenerated", "Event QR code regenerated", eventId);
  revalidateEvent(eventId);
}

export async function updatePortalSettingsAction(
  eventId: string,
  settings: {
    portal_gallery_visible?: boolean;
    reel_shareable?: boolean;
    retention_expires_at?: string | null;
  }
) {
  if (!isDevMode()) throw new Error("Portal settings require dev mode.");
  await updateEvent(eventId, settings);
  revalidateEvent(eventId);
}

export async function resendMemoriesEmailAction(eventId: string) {
  if (!isDevMode()) throw new Error("Notifications require dev mode.");
  logActivity("memories_email", "Memories ready email resent", eventId);
  revalidateEvent(eventId);
}
