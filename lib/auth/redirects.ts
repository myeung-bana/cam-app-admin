import { DEFAULT_ADMIN_REDIRECT, LOGIN_PATH } from "./constants";

export function sanitizeCallbackUrl(
  callbackUrl: string | null | undefined
): string {
  if (!callbackUrl || !callbackUrl.startsWith("/admin")) {
    return DEFAULT_ADMIN_REDIRECT;
  }

  return callbackUrl;
}

export function buildLoginRedirect(pathname: string, error?: string): string {
  const params = new URLSearchParams({ callbackUrl: pathname });
  if (error) params.set("error", error);
  return `${LOGIN_PATH}?${params.toString()}`;
}
