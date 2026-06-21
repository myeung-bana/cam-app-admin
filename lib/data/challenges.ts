import "server-only";
import { randomUUID } from "crypto";
import { isDevMode } from "@/lib/dev/config";
import {
  getDevChallenges,
  saveDevChallenges,
  loadChallengeTemplate,
} from "@/lib/dev/store";
import { isBackendConfigured } from "@/lib/nhost";
import { executeGraphQL } from "@/lib/graphql/execute";
import {
  GET_EVENT_CHALLENGES,
  GET_CHALLENGE_TEMPLATES_BY_EVENT_TYPE,
} from "@/lib/graphql/challenges/queries";
import {
  DELETE_EVENT_CHALLENGES,
  INSERT_CHALLENGES,
} from "@/lib/graphql/challenges/mutations";
import type { Challenge } from "@/lib/types";

export async function getEventChallenges(eventId: string): Promise<Challenge[]> {
  if (isDevMode()) return getDevChallenges(eventId);
  if (!isBackendConfigured()) return [];
  const data = await executeGraphQL<{ challenges: Challenge[] }>(
    GET_EVENT_CHALLENGES,
    { eventId }
  );
  return data.challenges;
}

export type ChallengeInput = Omit<Challenge, "event_id" | "id"> & {
  id?: string;
};

export async function saveEventChallenges(
  eventId: string,
  challenges: ChallengeInput[]
): Promise<Challenge[]> {
  if (isDevMode()) {
    return saveDevChallenges(
      eventId,
      challenges.map((c, index) => ({
        id: c.id ?? randomUUID(),
        title: c.title,
        description: c.description,
        icon: c.icon,
        is_required: c.is_required,
        sort_order: c.sort_order ?? index,
      }))
    );
  }

  await executeGraphQL(DELETE_EVENT_CHALLENGES, { eventId });

  if (challenges.length === 0) return [];

  const data = await executeGraphQL<{
    insert_challenges: { returning: Challenge[] };
  }>(INSERT_CHALLENGES, {
    objects: challenges.map((c, index) => ({
      event_id: eventId,
      title: c.title,
      description: c.description,
      icon: c.icon,
      is_required: c.is_required,
      sort_order: c.sort_order ?? index,
    })),
  });

  return data.insert_challenges.returning;
}

export async function applyChallengeTemplate(
  eventId: string,
  eventType: string
): Promise<Challenge[]> {
  if (isDevMode()) return loadChallengeTemplate(eventId, eventType);

  const templates = await executeGraphQL<{
    challenge_templates: Array<{
      label: string;
      description: string | null;
      icon: string;
      is_required: boolean;
      sort_order: number;
      slug: string;
    }>;
  }>(GET_CHALLENGE_TEMPLATES_BY_EVENT_TYPE, { eventTypeSlug: eventType });

  const challenges = templates.challenge_templates.map((t) => ({
    title: t.label,
    description: t.description ?? "",
    icon: t.icon,
    is_required: t.is_required,
    sort_order: t.sort_order,
  }));

  return saveEventChallenges(eventId, challenges);
}
