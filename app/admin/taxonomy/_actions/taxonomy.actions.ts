"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createEventTypeTaxonomy,
  updateEventTypeTaxonomy,
  createChallengeTaxonomy,
  updateChallengeTaxonomy,
} from "@/lib/data/taxonomy";
import {
  eventTypeTaxonomySchema,
  challengeTaxonomySchema,
} from "@/lib/schemas/taxonomy.schema";
import { isDevMode } from "@/lib/dev/config";
import type { TaxonomyKind } from "@/lib/types";
import { isTaxonomyKind } from "@/lib/taxonomy/registry";

function revalidateTaxonomy(kind: TaxonomyKind) {
  revalidatePath("/admin/taxonomy");
  revalidatePath(`/admin/taxonomy/${kind}`);
}

function parseBoolean(value: FormDataEntryValue | null): boolean | undefined {
  if (value === null || value === "") return undefined;
  return value === "true" || value === "on";
}

export async function createTaxonomyAction(
  kind: string,
  formData: FormData
) {
  if (!isDevMode()) throw new Error("Taxonomy requires dev mode.");
  if (!isTaxonomyKind(kind)) throw new Error("Invalid taxonomy kind.");

  const raw = Object.fromEntries(formData);

  if (kind === "event-types") {
    const parsed = eventTypeTaxonomySchema.safeParse({
      ...raw,
      active: parseBoolean(raw.active as string | null) ?? true,
    });
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const item = await createEventTypeTaxonomy(parsed.data);
    revalidateTaxonomy(kind);
    redirect(`/admin/taxonomy/${kind}/${item.id}`);
  }

  const parsed = challengeTaxonomySchema.safeParse({
    ...raw,
    is_required: parseBoolean(raw.is_required as string | null) ?? false,
    active: parseBoolean(raw.active as string | null) ?? true,
    event_type_slug: raw.event_type_slug || null,
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
  }
  const item = await createChallengeTaxonomy(parsed.data);
  revalidateTaxonomy(kind);
  redirect(`/admin/taxonomy/${kind}/${item.id}`);
}

export async function updateTaxonomyAction(
  kind: string,
  id: string,
  formData: FormData
) {
  if (!isDevMode()) throw new Error("Taxonomy requires dev mode.");
  if (!isTaxonomyKind(kind)) throw new Error("Invalid taxonomy kind.");

  const raw = Object.fromEntries(formData);

  if (kind === "event-types") {
    const parsed = eventTypeTaxonomySchema.safeParse({
      ...raw,
      active: parseBoolean(raw.active as string | null),
    });
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
    }
    await updateEventTypeTaxonomy(id, parsed.data);
    revalidateTaxonomy(kind);
    revalidatePath(`/admin/taxonomy/${kind}/${id}`);
    return;
  }

  const parsed = challengeTaxonomySchema.safeParse({
    ...raw,
    is_required: parseBoolean(raw.is_required as string | null),
    active: parseBoolean(raw.active as string | null),
    event_type_slug: raw.event_type_slug || null,
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
  }
  await updateChallengeTaxonomy(id, parsed.data);
  revalidateTaxonomy(kind);
  revalidatePath(`/admin/taxonomy/${kind}/${id}`);
}
