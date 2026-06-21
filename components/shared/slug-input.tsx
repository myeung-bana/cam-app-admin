"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SLUG_HELPER_TEXT,
  SLUG_INPUT_PATTERN,
  SLUG_MAX_LENGTH,
} from "@/lib/schemas/slug.schema";
import { normalizeSlugOnBlur, sanitizeSlugInput } from "@/lib/utils/slug";
import { cn } from "@/lib/utils";

interface SlugInputProps {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export function SlugInput({
  id,
  label = "Slug",
  value,
  onChange,
  onBlur,
  placeholder = "wedding-reception",
  error,
  className,
  disabled,
}: SlugInputProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        inputMode="text"
        pattern={SLUG_INPUT_PATTERN}
        maxLength={SLUG_MAX_LENGTH}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(sanitizeSlugInput(event.target.value))}
        onBlur={() => {
          onChange(normalizeSlugOnBlur(value));
          onBlur?.();
        }}
      />
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">{SLUG_HELPER_TEXT}</p>
      )}
    </div>
  );
}
