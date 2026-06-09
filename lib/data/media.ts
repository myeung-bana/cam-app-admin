import "server-only";
import { isDevMode } from "@/lib/dev/config";
import { getDevMedia, updateDevMedia } from "@/lib/dev/store";
import { isBackendConfigured } from "@/lib/nhost";
import { executeGraphQL } from "@/lib/graphql/execute";
import { GET_EVENT_MEDIA } from "@/lib/graphql/media/queries";
import type { Media } from "@/lib/types";

export async function getEventMedia(eventId: string): Promise<Media[]> {
  if (isDevMode()) return getDevMedia(eventId);
  if (!isBackendConfigured()) return [];
  const data = await executeGraphQL<{ media: Media[] }>(GET_EVENT_MEDIA, {
    eventId,
  });
  return data.media;
}

export async function updateMedia(
  id: string,
  updates: Partial<Pick<Media, "is_hidden" | "is_starred">>
): Promise<Media> {
  if (isDevMode()) return updateDevMedia(id, updates);
  throw new Error("Media updates require dev mode or a connected backend.");
}
