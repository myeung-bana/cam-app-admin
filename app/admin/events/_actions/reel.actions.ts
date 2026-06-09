"use server";

import { revalidatePath } from "next/cache";
import { generateReel, publishReel } from "@/lib/data/reels";
import { isDevMode } from "@/lib/dev/config";

function revalidateReel(eventId: string) {
  revalidatePath(`/admin/events/${eventId}/reel`);
  revalidatePath(`/admin/events/${eventId}/portal`);
}

export async function generateReelAction(eventId: string, musicTrack: string) {
  if (!isDevMode()) throw new Error("Reel generation requires dev mode.");
  await generateReel(eventId, musicTrack);
  revalidateReel(eventId);
}

export async function publishReelAction(eventId: string) {
  if (!isDevMode()) throw new Error("Reel publishing requires dev mode.");
  await publishReel(eventId);
  revalidateReel(eventId);
}
