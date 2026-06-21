import {
  createNhostClient,
  withAdminSession,
} from "@nhost/nhost-js";
import "server-only";

export const nhostServer = createNhostClient({
  subdomain: process.env.NHOST_SUBDOMAIN ?? "",
  region: process.env.NHOST_REGION ?? "",
  configure: process.env.NHOST_ADMIN_SECRET
    ? [
        withAdminSession({
          adminSecret: process.env.NHOST_ADMIN_SECRET,
        }),
      ]
    : [],
});

export function isBackendConfigured(): boolean {
  return Boolean(
    process.env.NHOST_SUBDOMAIN &&
      process.env.NHOST_REGION &&
      process.env.NHOST_ADMIN_SECRET &&
      process.env.NHOST_ADMIN_SECRET !== "your-hasura-admin-secret"
  );
}

export function getHasuraUrl(): string {
  const subdomain = process.env.NHOST_SUBDOMAIN!;
  const region = process.env.NHOST_REGION!;
  return `https://${subdomain}.hasura.${region}.nhost.run/v1/graphql`;
}
