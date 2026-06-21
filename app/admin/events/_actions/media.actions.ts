"use server";

import { revalidatePath } from "next/cache";
import { updateMedia } from "@/lib/data/media";

export async function toggleMediaStarAction(
  eventId: string,
  mediaId: string,
  starred: boolean
) {
  await updateMedia(mediaId, { is_starred: starred });
  revalidatePath(`/admin/events/${eventId}/media`);
}

export async function toggleMediaHiddenAction(
  eventId: string,
  mediaId: string,
  hidden: boolean
) {
  await updateMedia(mediaId, { is_hidden: hidden });
  revalidatePath(`/admin/events/${eventId}/media`);
  revalidatePath(`/admin/events/${eventId}/live`);
}
