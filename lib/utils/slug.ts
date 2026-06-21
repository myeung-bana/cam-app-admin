/** Normalize slug text while the user types. */
export function sanitizeSlugInput(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 64);
}

/** Trim edge hyphens after editing. */
export function normalizeSlugOnBlur(raw: string): string {
  return sanitizeSlugInput(raw).replace(/^-+|-+$/g, "");
}
