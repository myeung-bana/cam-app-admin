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
import { requireLiveBackend } from "@/lib/config/backend";
import { executeGraphQL } from "@/lib/graphql/execute";
import {
  GET_EVENT_TYPE_TAXONOMY,
  GET_ALL_EVENT_TYPE_TAXONOMY,
  GET_EVENT_TYPE_TAXONOMY_BY_ID,
  GET_CHALLENGE_TAXONOMY,
  GET_CHALLENGE_TAXONOMY_BY_ID,
} from "@/lib/graphql/taxonomy/queries";
import {
  INSERT_EVENT_TYPE,
  UPDATE_EVENT_TYPE,
  INSERT_CHALLENGE_TEMPLATE,
  UPDATE_CHALLENGE_TEMPLATE,
} from "@/lib/graphql/taxonomy/mutations";
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

interface EventTypeRow {
  id: string;
  slug: string;
  label: string;
  description?: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

interface ChallengeTemplateRow {
  id: string;
  slug: string;
  label: string;
  description?: string | null;
  icon: string;
  is_required: boolean;
  event_type_slug?: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

function mapEventType(row: EventTypeRow): EventTypeTaxonomy {
  return {
    kind: "event-types",
    id: row.id,
    slug: row.slug,
    label: row.label,
    description: row.description ?? null,
    sort_order: row.sort_order,
    active: row.active,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapChallenge(row: ChallengeTemplateRow): ChallengeTaxonomy {
  return {
    kind: "challenges",
    id: row.id,
    slug: row.slug,
    label: row.label,
    description: row.description ?? null,
    icon: row.icon,
    is_required: row.is_required,
    event_type_slug: row.event_type_slug ?? null,
    sort_order: row.sort_order,
    active: row.active,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function getEventTypeOptions(): Promise<TaxonomyOption[]> {
  const items = await getEventTypeTaxonomy();
  return items.map((t) => ({ value: t.slug, label: t.label }));
}

export async function getEventTypeTaxonomy(): Promise<EventTypeTaxonomy[]> {
  if (isDevMode()) return getDevEventTypeTaxonomy();
  if (!isBackendConfigured()) return [];
  const data = await executeGraphQL<{ event_types: EventTypeRow[] }>(
    GET_EVENT_TYPE_TAXONOMY
  );
  return data.event_types.map(mapEventType);
}

export async function getAllEventTypeTaxonomy(): Promise<EventTypeTaxonomy[]> {
  if (isDevMode()) return getDevAllEventTypeTaxonomy();
  if (!isBackendConfigured()) return [];
  const data = await executeGraphQL<{ event_types: EventTypeRow[] }>(
    GET_ALL_EVENT_TYPE_TAXONOMY
  );
  return data.event_types.map(mapEventType);
}

export async function getEventTypeTaxonomyById(
  id: string
): Promise<EventTypeTaxonomy | null> {
  if (isDevMode()) return getDevEventTypeTaxonomyById(id);
  if (!isBackendConfigured()) return null;
  const data = await executeGraphQL<{
    event_types_by_pk: EventTypeRow | null;
  }>(GET_EVENT_TYPE_TAXONOMY_BY_ID, { id });
  return data.event_types_by_pk ? mapEventType(data.event_types_by_pk) : null;
}

export async function createEventTypeTaxonomy(
  input: CreateEventTypeTaxonomyInput
): Promise<EventTypeTaxonomy> {
  if (isDevMode()) return createDevEventTypeTaxonomy(input);
  requireLiveBackend();
  const data = await executeGraphQL<{ insert_event_types_one: EventTypeRow }>(
    INSERT_EVENT_TYPE,
    {
      object: {
        slug: input.slug,
        label: input.label,
        description: input.description ?? null,
        sort_order: input.sort_order ?? 0,
        active: input.active ?? true,
      },
    }
  );
  return mapEventType(data.insert_event_types_one);
}

export async function updateEventTypeTaxonomy(
  id: string,
  input: UpdateEventTypeTaxonomyInput
): Promise<EventTypeTaxonomy> {
  if (isDevMode()) return updateDevEventTypeTaxonomy(id, input);
  requireLiveBackend();
  const data = await executeGraphQL<{ update_event_types_by_pk: EventTypeRow }>(
    UPDATE_EVENT_TYPE,
    { id, set: input }
  );
  return mapEventType(data.update_event_types_by_pk);
}

export async function getChallengeTaxonomy(): Promise<ChallengeTaxonomy[]> {
  if (isDevMode()) return getDevChallengeTaxonomy();
  if (!isBackendConfigured()) return [];
  const data = await executeGraphQL<{ challenge_templates: ChallengeTemplateRow[] }>(
    GET_CHALLENGE_TAXONOMY
  );
  return data.challenge_templates.map(mapChallenge);
}

export async function getChallengeTaxonomyById(
  id: string
): Promise<ChallengeTaxonomy | null> {
  if (isDevMode()) return getDevChallengeTaxonomyById(id);
  if (!isBackendConfigured()) return null;
  const data = await executeGraphQL<{
    challenge_templates_by_pk: ChallengeTemplateRow | null;
  }>(GET_CHALLENGE_TAXONOMY_BY_ID, { id });
  return data.challenge_templates_by_pk
    ? mapChallenge(data.challenge_templates_by_pk)
    : null;
}

export async function createChallengeTaxonomy(
  input: CreateChallengeTaxonomyInput
): Promise<ChallengeTaxonomy> {
  if (isDevMode()) return createDevChallengeTaxonomy(input);
  requireLiveBackend();
  const data = await executeGraphQL<{
    insert_challenge_templates_one: ChallengeTemplateRow;
  }>(INSERT_CHALLENGE_TEMPLATE, {
    object: {
      slug: input.slug,
      label: input.label,
      description: input.description ?? null,
      icon: input.icon ?? "📸",
      is_required: input.is_required ?? false,
      event_type_slug: input.event_type_slug ?? null,
      sort_order: input.sort_order ?? 0,
      active: input.active ?? true,
    },
  });
  return mapChallenge(data.insert_challenge_templates_one);
}

export async function updateChallengeTaxonomy(
  id: string,
  input: UpdateChallengeTaxonomyInput
): Promise<ChallengeTaxonomy> {
  if (isDevMode()) return updateDevChallengeTaxonomy(id, input);
  requireLiveBackend();
  const data = await executeGraphQL<{
    update_challenge_templates_by_pk: ChallengeTemplateRow;
  }>(UPDATE_CHALLENGE_TEMPLATE, { id, set: input });
  return mapChallenge(data.update_challenge_templates_by_pk);
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
