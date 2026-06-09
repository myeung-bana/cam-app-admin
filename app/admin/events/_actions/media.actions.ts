"use server";

import { revalidatePath } from "next/cache";
import { updateMedia } from "@/lib/data/media";
import { isDevMode } from "@/lib/dev/config";

export async function toggleMediaStarAction(
  eventId: string,
  mediaId: string,
  starred: boolean
) {
  if (!isDevMode()) throw new Error("Media updates require dev mode.");
  await updateMedia(mediaId, { is_starred: starred });
  revalidatePath(`/admin/events/${eventId}/media`);
}

export async function toggleMediaHiddenAction(
  eventId: string,
  mediaId: string,
  hidden: boolean
) {
  if (!isDevMode()) throw new Error("Media updates require dev mode.");
  await updateMedia(mediaId, { is_hidden: hidden });
  revalidatePath(`/admin/events/${eventId}/media`);
}
