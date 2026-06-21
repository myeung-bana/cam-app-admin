import { z } from "zod";

/** Lowercase letters, numbers, hyphens; must start with a letter; no leading/trailing hyphens. */
export const SLUG_REGEX = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

export const SLUG_MAX_LENGTH = 64;

export const slugSchema = z
  .string()
  .trim()
  .min(2, "Slug must be at least 2 characters")
  .max(SLUG_MAX_LENGTH, `Slug must be ${SLUG_MAX_LENGTH} characters or fewer`)
  .regex(
    SLUG_REGEX,
    "Use lowercase letters, numbers, and hyphens only. Must start with a letter."
  );

export const SLUG_HELPER_TEXT =
  "Lowercase letters, numbers, and hyphens only. Must start with a letter (e.g. wedding-reception).";

export const SLUG_INPUT_PATTERN = "[a-z][a-z0-9-]*";
