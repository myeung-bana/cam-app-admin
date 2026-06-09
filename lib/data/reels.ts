import "server-only";
import { isDevMode } from "@/lib/dev/config";
import { getDevReel, createDevReel, publishDevReel } from "@/lib/dev/store";
import type { Reel } from "@/lib/types";

export async function getEventReel(eventId: string): Promise<Reel | null> {
  if (isDevMode()) return getDevReel(eventId);
  return null;
}

export async function generateReel(
  eventId: string,
  musicTrack: string
): Promise<Reel> {
  if (isDevMode()) return createDevReel(eventId, musicTrack);
  throw new Error("Reel generation requires dev mode or a connected backend.");
}

export async function publishReel(eventId: string): Promise<Reel> {
  if (isDevMode()) return publishDevReel(eventId);
  throw new Error("Reel publishing requires dev mode or a connected backend.");
}
