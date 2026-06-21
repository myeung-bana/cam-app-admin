import { jwtDecode } from "jwt-decode";

/** Refresh slightly before expiry to avoid race with upstream JWT verification. */
const REFRESH_SKEW_SECONDS = 60;

export function isAccessTokenExpired(accessToken: string): boolean {
  try {
    const { exp } = jwtDecode<{ exp?: number }>(accessToken);
    if (!exp) return false;
    return exp <= Math.floor(Date.now() / 1000) + REFRESH_SKEW_SECONDS;
  } catch {
    return true;
  }
}
