import { randomBytes } from "crypto";

const JOIN_CODE_ALPHABET =
  "0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";

export function generateJoinCode(length = 10): string {
  const bytes = randomBytes(length);
  return Array.from(bytes, (b) => JOIN_CODE_ALPHABET[b % JOIN_CODE_ALPHABET.length]).join("");
}

export function buildGuestJoinUrl(joinCode: string, guestAppUrl?: string): string {
  const base =
    guestAppUrl ??
    process.env.NEXT_PUBLIC_GUEST_APP_URL ??
    process.env.GUEST_APP_URL ??
    "http://localhost:3001";
  return `${base.replace(/\/$/, "")}/j/${joinCode}`;
}
