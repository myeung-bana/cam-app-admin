import "server-only";

interface FunctionEnvelope<T> {
  ok: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

export interface CallFunctionOptions {
  method?: string;
  body?: unknown;
  /** User JWT — auth routes and non-admin callers. */
  accessToken?: string;
  /** Trusted cam-app-admin server → Function (matches Hasura admin secret). */
  useAdminSecret?: boolean;
  /** Optional audit attribution when using useAdminSecret. */
  actingAdminUserId?: string;
  query?: Record<string, string>;
}

function getFunctionsUrl(): string {
  if (process.env.NHOST_FUNCTIONS_URL) {
    return process.env.NHOST_FUNCTIONS_URL.replace(/\/$/, "");
  }

  const subdomain =
    process.env.NHOST_SUBDOMAIN ?? process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN;
  const region = process.env.NHOST_REGION ?? process.env.NEXT_PUBLIC_NHOST_REGION;

  if (subdomain && region) {
    return `https://${subdomain}.functions.${region}.nhost.run/v1`;
  }

  throw new Error(
    "Missing functions URL — set NHOST_FUNCTIONS_URL or NHOST_SUBDOMAIN + NHOST_REGION"
  );
}

function getAdminSecret(): string {
  const secret = process.env.NHOST_ADMIN_SECRET;
  if (!secret || secret === "your-hasura-admin-secret") {
    throw new Error("NHOST_ADMIN_SECRET is not configured");
  }
  return secret;
}

export async function callFunction<T>(
  path: string,
  options: CallFunctionOptions = {}
): Promise<T> {
  const url = new URL(`${getFunctionsUrl()}${path}`);
  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      url.searchParams.set(key, value);
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.useAdminSecret) {
    headers["x-hasura-admin-secret"] = getAdminSecret();
    if (options.actingAdminUserId) {
      headers["x-memo-admin-user-id"] = options.actingAdminUserId;
    }
  } else if (options.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  const response = await fetch(url.toString(), {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  const envelope = (await response.json().catch(() => ({}))) as FunctionEnvelope<T>;

  if (!response.ok || !envelope.ok || envelope.data === undefined) {
    throw new Error(envelope.error ?? "Function request failed");
  }

  return envelope.data;
}

/** Control-plane calls from cam-app-admin — same credential as Hasura GraphQL. */
export async function callAdminFunction<T>(
  path: string,
  options: Omit<CallFunctionOptions, "accessToken" | "useAdminSecret"> = {}
): Promise<T> {
  return callFunction<T>(path, { ...options, useAdminSecret: true });
}

export function isFunctionsConfigured(): boolean {
  try {
    getFunctionsUrl();
    return true;
  } catch {
    return false;
  }
}
