import "server-only";
import { isDevMode } from "@/lib/dev/config";
import { getDevMedia, updateDevMedia } from "@/lib/dev/store";
import { isBackendConfigured } from "@/lib/nhost";
import { executeGraphQL } from "@/lib/graphql/execute";
import { GET_EVENT_MEDIA } from "@/lib/graphql/media/queries";
import { UPDATE_MEDIA } from "@/lib/graphql/media/mutations";
import type { Media } from "@/lib/types";

interface MediaRow {
  id: string;
  event_id: string;
  file_url: string;
  storage_file_id?: string | null;
  file_type: "photo" | "video";
  filter_applied?: string | null;
  challenge_id?: string | null;
  uploaded_at: string;
  is_hidden: boolean;
  is_starred: boolean;
  session?: { display_name: string | null };
}

function mapMedia(row: MediaRow): Media {
  return {
    id: row.id,
    event_id: row.event_id,
    file_url: row.file_url,
    storage_file_id: row.storage_file_id ?? null,
    file_type: row.file_type,
    filter_applied: row.filter_applied ?? null,
    challenge_tag: row.challenge_id ?? null,
    uploaded_at: row.uploaded_at,
    is_hidden: row.is_hidden,
    is_starred: row.is_starred,
    session: row.session,
  };
}

export async function getEventMedia(eventId: string): Promise<Media[]> {
  if (isDevMode()) return getDevMedia(eventId);
  if (!isBackendConfigured()) return [];
  const data = await executeGraphQL<{ media: MediaRow[] }>(GET_EVENT_MEDIA, {
    eventId,
  });
  return data.media.map(mapMedia);
}

export async function updateMedia(
  id: string,
  updates: Partial<Pick<Media, "is_hidden" | "is_starred">>
): Promise<Media> {
  if (isDevMode()) return updateDevMedia(id, updates);
  const data = await executeGraphQL<{ update_media_by_pk: MediaRow }>(
    UPDATE_MEDIA,
    { id, set: updates }
  );
  return mapMedia(data.update_media_by_pk);
}
