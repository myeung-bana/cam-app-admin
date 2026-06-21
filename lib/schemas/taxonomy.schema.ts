import { z } from "zod";
import { slugSchema } from "@/lib/schemas/slug.schema";

export const eventTypeTaxonomySchema = z.object({
  slug: slugSchema,
  label: z.string().min(2, "Label is required"),
  description: z.string().optional(),
  sort_order: z.coerce.number().int().min(0).optional(),
  active: z.coerce.boolean().optional(),
});

export const challengeTaxonomySchema = z.object({
  slug: slugSchema,
  label: z.string().min(2, "Label is required"),
  description: z.string().optional(),
  icon: z.string().min(1, "Emoji is required"),
  is_required: z.coerce.boolean().optional(),
  event_type_slug: z.string().optional().nullable(),
  sort_order: z.coerce.number().int().min(0).optional(),
  active: z.coerce.boolean().optional(),
});

export type EventTypeTaxonomyInput = z.infer<typeof eventTypeTaxonomySchema>;
export type ChallengeTaxonomyInput = z.infer<typeof challengeTaxonomySchema>;
