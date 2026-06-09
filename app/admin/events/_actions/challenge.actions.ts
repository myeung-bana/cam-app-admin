"use server";

import { revalidatePath } from "next/cache";
import {
  saveEventChallenges,
  applyChallengeTemplate,
} from "@/lib/data/challenges";
import { isDevMode } from "@/lib/dev/config";
import type { Challenge } from "@/lib/types";

export async function saveChallengesAction(
  eventId: string,
  challenges: Omit<Challenge, "event_id">[]
) {
  if (!isDevMode()) throw new Error("Challenge saving requires dev mode.");
  await saveEventChallenges(eventId, challenges);
  revalidatePath(`/admin/events/${eventId}/challenges`);
}

export async function loadChallengeTemplateAction(
  eventId: string,
  eventType: string
) {
  if (!isDevMode()) throw new Error("Templates require dev mode.");
  await applyChallengeTemplate(eventId, eventType);
  revalidatePath(`/admin/events/${eventId}/challenges`);
}
