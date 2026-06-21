"use server";

import { revalidatePath } from "next/cache";
import { redirectWithSuccessFlash } from "@/lib/flash/redirect-with-success";
import {
  createEvent,
  updateEvent,
  transitionEventStatus,
  rotateEventJoinCode,
} from "@/lib/data/events";
import { eventSchema } from "@/lib/schemas/event.schema";
import { isDevMode } from "@/lib/dev/config";
import { logActivity } from "@/lib/dev/store";
import { rotateJoinCodeFromFunction } from "@/lib/functions/admin-events";
import { isFunctionsConfigured } from "@/lib/functions/client";
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
  redirectWithSuccessFlash(`/admin/events/${event.id}`, "eventCreated");
}

export async function transitionEventStatusAction(
  eventId: string,
  status: EventStatus
) {
  await transitionEventStatus(eventId, status);
  revalidateEvent(eventId);
}

export async function adjustEventCapAction(eventId: string, cap: number) {
  if (cap < 1) throw new Error("Cap must be at least 1");
  await updateEvent(eventId, { max_attendees: cap });
  if (isDevMode()) {
    logActivity("cap_adjusted", `Attendee cap set to ${cap}`, eventId);
  }
  revalidateEvent(eventId);
}

export async function rotateJoinCodeAction(eventId: string) {
  if (!isDevMode() && isFunctionsConfigured()) {
    const result = await rotateJoinCodeFromFunction(eventId);
    revalidateEvent(eventId);
    return { joinCode: result.joinCode };
  }

  const event = await rotateEventJoinCode(eventId);
  revalidateEvent(eventId);
  return { joinCode: event.join_code };
}

export async function updatePortalSettingsAction(
  eventId: string,
  settings: {
    portal_gallery_visible?: boolean;
    reel_shareable?: boolean;
    retention_expires_at?: string | null;
  }
) {
  await updateEvent(eventId, settings);
  revalidateEvent(eventId);
}

export async function resendMemoriesEmailAction(eventId: string) {
  if (isDevMode()) {
    logActivity("memories_email", "Memories ready email resent", eventId);
  }
  revalidateEvent(eventId);
}
