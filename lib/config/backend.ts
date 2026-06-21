import "server-only";
import { isBackendConfigured } from "@/lib/nhost";
import { isDevMode } from "@/lib/dev/config";

export function getMissingBackendEnvVars(): string[] {
  const missing: string[] = [];
  if (!process.env.NHOST_SUBDOMAIN) missing.push("NHOST_SUBDOMAIN");
  if (!process.env.NHOST_REGION) missing.push("NHOST_REGION");
  if (
    !process.env.NHOST_ADMIN_SECRET ||
    process.env.NHOST_ADMIN_SECRET === "your-hasura-admin-secret"
  ) {
    missing.push("NHOST_ADMIN_SECRET");
  }
  return missing;
}

export function isLiveBackendEnabled(): boolean {
  return !isDevMode() && isBackendConfigured();
}

export function requireLiveBackend(): void {
  if (isDevMode()) return;
  if (isBackendConfigured()) return;
  const missing = getMissingBackendEnvVars();
  throw new Error(
    `Nhost not configured — set ${missing.join(", ")} in .env.local`
  );
}
