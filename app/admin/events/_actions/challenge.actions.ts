"use server";

import { revalidatePath } from "next/cache";
import {
  saveEventChallenges,
  applyChallengeTemplate,
} from "@/lib/data/challenges";
import type { Challenge } from "@/lib/types";

export async function saveChallengesAction(
  eventId: string,
  challenges: Omit<Challenge, "event_id">[]
) {
  await saveEventChallenges(eventId, challenges);
  revalidatePath(`/admin/events/${eventId}/challenges`);
}

export async function loadChallengeTemplateAction(
  eventId: string,
  eventType: string
) {
  await applyChallengeTemplate(eventId, eventType);
  revalidatePath(`/admin/events/${eventId}/challenges`);
}
