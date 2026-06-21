import type { AdminUser, AdminUserRole, AdminUserStatus } from "@/lib/types";

export interface AuthUserAdminMetadata {
  adminRole?: AdminUserRole;
  notes?: string;
}

export interface AuthUserRow {
  id: string;
  email: string;
  displayName?: string | null;
  disabled: boolean;
  lastSeen?: string | null;
  createdAt: string;
  updatedAt?: string;
  phoneNumber?: string | null;
  metadata?: unknown;
  roles: Array<{ role: string }>;
}

export function hasAdminRole(roles: Array<{ role: string }>): boolean {
  return roles.some((entry) => entry.role === "admin");
}

export function parseAdminUserMetadata(
  metadata: unknown
): AuthUserAdminMetadata {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {};
  }

  const record = metadata as Record<string, unknown>;
  const adminRole =
    record.adminRole === "owner" || record.adminRole === "admin"
      ? record.adminRole
      : undefined;
  const notes = typeof record.notes === "string" ? record.notes : undefined;

  return { adminRole, notes };
}

export function buildAdminUserMetadata(
  profile: AuthUserAdminMetadata,
  existing?: unknown
): Record<string, unknown> {
  const base =
    existing && typeof existing === "object" && !Array.isArray(existing)
      ? { ...(existing as Record<string, unknown>) }
      : {};

  if (profile.adminRole !== undefined) {
    base.adminRole = profile.adminRole;
  }
  if (profile.notes !== undefined) {
    base.notes = profile.notes;
  }

  return base;
}

export function mapAuthUserToAdminUser(row: AuthUserRow): AdminUser {
  const metadata = parseAdminUserMetadata(row.metadata);

  return {
    id: row.id,
    name: row.displayName?.trim() || row.email,
    email: row.email,
    role: metadata.adminRole ?? "admin",
    status: row.disabled ? "inactive" : "active",
    phone: row.phoneNumber ?? null,
    notes: metadata.notes ?? null,
    last_login_at: row.lastSeen ?? null,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}
