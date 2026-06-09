import { createHmac } from "crypto";

export function generateQrToken(eventId: string, secret: string): string {
  return createHmac("sha256", secret).update(eventId).digest("hex");
}

export function buildEventUrl(
  eventId: string,
  token: string,
  appUrl: string
): string {
  return `${appUrl}/event/${eventId}?token=${token}`;
}
