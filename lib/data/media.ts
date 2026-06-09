import "server-only";
import { isBackendConfigured } from "@/lib/nhost";
import { executeGraphQL } from "@/lib/graphql/execute";
import { GET_EVENT_MEDIA } from "@/lib/graphql/media/queries";
import type { Media } from "@/lib/types";

export async function getEventMedia(eventId: string): Promise<Media[]> {
  if (!isBackendConfigured()) return [];

  const data = await executeGraphQL<{ media: Media[] }>(GET_EVENT_MEDIA, {
    eventId,
  });
  return data.media;
}
