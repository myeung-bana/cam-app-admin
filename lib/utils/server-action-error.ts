import { isRedirectError } from "next/dist/client/components/redirect-error";

/** Rethrow Next.js redirect errors so navigation completes after server actions. */
export function rethrowIfRedirect(error: unknown): void {
  if (isRedirectError(error)) {
    throw error;
  }
}

export function getActionErrorMessage(
  error: unknown,
  fallback = "Something went wrong"
): string {
  rethrowIfRedirect(error);
  return error instanceof Error ? error.message : fallback;
}
