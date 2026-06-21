import "server-only";
import { callAdminFunction } from "@/lib/functions/client";
import { getActingAdminUserId } from "@/lib/functions/admin-call-context";

export interface EventQrResult {
  joinUrl: string;
  joinCode: string;
  svg: string;
}

export async function getEventQrFromFunction(
  eventId: string
): Promise<EventQrResult> {
  return callAdminFunction<EventQrResult>("/admin/events/get-qr", {
    query: { eventId },
    actingAdminUserId: await getActingAdminUserId(),
  });
}

export async function rotateJoinCodeFromFunction(
  eventId: string
): Promise<{ eventId: string; joinCode: string; previousJoinCode: string }> {
  return callAdminFunction("/admin/events/rotate-join-code", {
    method: "POST",
    body: { eventId },
    actingAdminUserId: await getActingAdminUserId(),
  });
}
