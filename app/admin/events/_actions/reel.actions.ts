"use server";

import { revalidatePath } from "next/cache";
import { generateReel, publishReel } from "@/lib/data/reels";

function revalidateReel(eventId: string) {
  revalidatePath(`/admin/events/${eventId}/reel`);
  revalidatePath(`/admin/events/${eventId}/portal`);
}

export async function generateReelAction(eventId: string, musicTrack: string) {
  await generateReel(eventId, musicTrack);
  revalidateReel(eventId);
}

export async function publishReelAction(eventId: string) {
  await publishReel(eventId);
  revalidateReel(eventId);
}
