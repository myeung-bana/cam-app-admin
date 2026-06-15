import type { TaxonomyKind } from "@/lib/types";

export interface TaxonomyKindConfig {
  kind: TaxonomyKind;
  label: string;
  description: string;
  singularLabel: string;
}

export const TAXONOMY_REGISTRY: Record<TaxonomyKind, TaxonomyKindConfig> = {
  "event-types": {
    kind: "event-types",
    label: "Event Types",
    singularLabel: "Event Type",
    description:
      "Categories used when creating events and setting client preferences.",
  },
  challenges: {
    kind: "challenges",
    label: "Challenges",
    singularLabel: "Challenge",
    description:
      "Reusable photo challenge prompts loaded as templates per event type.",
  },
};

export const TAXONOMY_KINDS = Object.keys(TAXONOMY_REGISTRY) as TaxonomyKind[];

export function isTaxonomyKind(value: string): value is TaxonomyKind {
  return value in TAXONOMY_REGISTRY;
}

export function getTaxonomyConfig(kind: TaxonomyKind): TaxonomyKindConfig {
  return TAXONOMY_REGISTRY[kind];
}
