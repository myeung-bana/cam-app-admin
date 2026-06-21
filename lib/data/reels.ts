import "server-only";
import { isDevMode } from "@/lib/dev/config";
import { getDevReel, createDevReel, publishDevReel } from "@/lib/dev/store";
import { isBackendConfigured } from "@/lib/nhost";
import { executeGraphQL } from "@/lib/graphql/execute";
import { GET_EVENT_REEL } from "@/lib/graphql/reels/queries";
import { INSERT_REEL, UPDATE_REEL } from "@/lib/graphql/reels/mutations";
import type { Reel } from "@/lib/types";

export async function getEventReel(eventId: string): Promise<Reel | null> {
  if (isDevMode()) return getDevReel(eventId);
  if (!isBackendConfigured()) return null;
  const data = await executeGraphQL<{ reels: Reel[] }>(GET_EVENT_REEL, {
    eventId,
  });
  return data.reels[0] ?? null;
}

export async function generateReel(
  eventId: string,
  musicTrack: string
): Promise<Reel> {
  if (isDevMode()) return createDevReel(eventId, musicTrack);
  const data = await executeGraphQL<{ insert_reels_one: Reel }>(INSERT_REEL, {
    object: {
      event_id: eventId,
      music_track: musicTrack,
      status: "queued",
    },
  });
  return data.insert_reels_one;
}

export async function publishReel(eventId: string): Promise<Reel> {
  if (isDevMode()) return publishDevReel(eventId);
  const existing = await getEventReel(eventId);
  if (!existing) {
    throw new Error("No reel to publish");
  }
  const data = await executeGraphQL<{ update_reels_by_pk: Reel }>(UPDATE_REEL, {
    id: existing.id,
    set: {
      status: "ready",
      published_at: new Date().toISOString(),
    },
  });
  return data.update_reels_by_pk;
}
