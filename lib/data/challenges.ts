import "server-only";
import { isDevMode } from "@/lib/dev/config";
import {
  getDevChallenges,
  saveDevChallenges,
  loadChallengeTemplate,
} from "@/lib/dev/store";
import type { Challenge } from "@/lib/types";

export async function getEventChallenges(eventId: string): Promise<Challenge[]> {
  if (isDevMode()) return getDevChallenges(eventId);
  return [];
}

export async function saveEventChallenges(
  eventId: string,
  challenges: Omit<Challenge, "event_id">[]
): Promise<Challenge[]> {
  if (isDevMode()) return saveDevChallenges(eventId, challenges);
  throw new Error("Challenge saving requires dev mode or a connected backend.");
}

export async function applyChallengeTemplate(
  eventId: string,
  eventType: string
): Promise<Challenge[]> {
  if (isDevMode()) return loadChallengeTemplate(eventId, eventType);
  throw new Error("Templates require dev mode or a connected backend.");
}
