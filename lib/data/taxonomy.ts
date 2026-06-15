import "server-only";
import { isDevMode } from "@/lib/dev/config";
import {
  getDevAllEventTypeTaxonomy,
  getDevEventTypeTaxonomy,
  getDevEventTypeTaxonomyById,
  createDevEventTypeTaxonomy,
  updateDevEventTypeTaxonomy,
  getDevChallengeTaxonomy,
  getDevChallengeTaxonomyById,
  createDevChallengeTaxonomy,
  updateDevChallengeTaxonomy,
} from "@/lib/dev/store";
import { isBackendConfigured } from "@/lib/nhost";
import type {
  TaxonomyKind,
  EventTypeTaxonomy,
  ChallengeTaxonomy,
  CreateEventTypeTaxonomyInput,
  UpdateEventTypeTaxonomyInput,
  CreateChallengeTaxonomyInput,
  UpdateChallengeTaxonomyInput,
} from "@/lib/types";

export interface TaxonomyOption {
  value: string;
  label: string;
}

export async function getEventTypeOptions(): Promise<TaxonomyOption[]> {
  const items = await getEventTypeTaxonomy();
  return items.map((t) => ({ value: t.slug, label: t.label }));
}

export async function getEventTypeTaxonomy(): Promise<EventTypeTaxonomy[]> {
  if (isDevMode()) return getDevEventTypeTaxonomy();
  if (!isBackendConfigured()) return [];
  return [];
}

export async function getAllEventTypeTaxonomy(): Promise<EventTypeTaxonomy[]> {
  if (isDevMode()) return getDevAllEventTypeTaxonomy();
  if (!isBackendConfigured()) return [];
  return [];
}

export async function getEventTypeTaxonomyById(
  id: string
): Promise<EventTypeTaxonomy | null> {
  if (isDevMode()) return getDevEventTypeTaxonomyById(id);
  return null;
}

export async function createEventTypeTaxonomy(
  input: CreateEventTypeTaxonomyInput
): Promise<EventTypeTaxonomy> {
  if (isDevMode()) return createDevEventTypeTaxonomy(input);
  throw new Error("Taxonomy requires dev mode or a connected backend.");
}

export async function updateEventTypeTaxonomy(
  id: string,
  input: UpdateEventTypeTaxonomyInput
): Promise<EventTypeTaxonomy> {
  if (isDevMode()) return updateDevEventTypeTaxonomy(id, input);
  throw new Error("Taxonomy requires dev mode or a connected backend.");
}

export async function getChallengeTaxonomy(): Promise<ChallengeTaxonomy[]> {
  if (isDevMode()) return getDevChallengeTaxonomy();
  if (!isBackendConfigured()) return [];
  return [];
}

export async function getChallengeTaxonomyById(
  id: string
): Promise<ChallengeTaxonomy | null> {
  if (isDevMode()) return getDevChallengeTaxonomyById(id);
  return null;
}

export async function createChallengeTaxonomy(
  input: CreateChallengeTaxonomyInput
): Promise<ChallengeTaxonomy> {
  if (isDevMode()) return createDevChallengeTaxonomy(input);
  throw new Error("Taxonomy requires dev mode or a connected backend.");
}

export async function updateChallengeTaxonomy(
  id: string,
  input: UpdateChallengeTaxonomyInput
): Promise<ChallengeTaxonomy> {
  if (isDevMode()) return updateDevChallengeTaxonomy(id, input);
  throw new Error("Taxonomy requires dev mode or a connected backend.");
}

export async function getTaxonomyCounts(): Promise<
  Record<TaxonomyKind, number>
> {
  const [eventTypes, challenges] = await Promise.all([
    getAllEventTypeTaxonomy(),
    getChallengeTaxonomy(),
  ]);
  return {
    "event-types": eventTypes.length,
    challenges: challenges.length,
  };
}
