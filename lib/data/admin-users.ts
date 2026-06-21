import "server-only";
import { isDevMode } from "@/lib/dev/config";
import {
  getDevAdminUsers,
  getDevAdminUserById,
  createDevAdminUser,
  updateDevAdminUser,
} from "@/lib/dev/store";
import { isBackendConfigured } from "@/lib/nhost";
import { executeGraphQL } from "@/lib/graphql/execute";
import {
  GET_ADMIN_USERS,
  GET_ADMIN_USER_BY_ID,
} from "@/lib/graphql/admin-users/queries";
import { UPDATE_ADMIN_USER } from "@/lib/graphql/admin-users/mutations";
import { createAdminUserFromFunction } from "@/lib/functions/admin-users";
import {
  AuthUserRow,
  buildAdminUserMetadata,
  hasAdminRole,
  mapAuthUserToAdminUser,
  parseAdminUserMetadata,
} from "@/lib/auth/admin-user-profile";
import type {
  AdminUser,
  CreateAdminUserInput,
  UpdateAdminUserInput,
} from "@/lib/types";

function mapAuthUserRow(row: AuthUserRow | null | undefined): AdminUser | null {
  if (!row || !hasAdminRole(row.roles)) return null;
  return mapAuthUserToAdminUser(row);
}

function buildAuthUserUpdate(
  input: UpdateAdminUserInput,
  existing?: AuthUserRow
) {
  const set: Record<string, unknown> = {};

  if (input.name !== undefined) {
    set.displayName = input.name;
  }
  if (input.status !== undefined) {
    set.disabled = input.status === "inactive";
  }
  if (input.phone !== undefined) {
    set.phoneNumber = input.phone || null;
  }

  if (input.role !== undefined || input.notes !== undefined) {
    const existingMeta = parseAdminUserMetadata(existing?.metadata);
    set.metadata = buildAdminUserMetadata(
      {
        adminRole: input.role ?? existingMeta.adminRole,
        notes: input.notes ?? existingMeta.notes,
      },
      existing?.metadata
    );
  }

  return set;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  if (isDevMode()) return getDevAdminUsers();
  if (!isBackendConfigured()) return [];
  const data = await executeGraphQL<{ users: AuthUserRow[] }>(GET_ADMIN_USERS);
  return data.users.map(mapAuthUserToAdminUser);
}

export async function getAdminUserById(id: string): Promise<AdminUser | null> {
  if (isDevMode()) return getDevAdminUserById(id);
  if (!isBackendConfigured()) return null;
  const data = await executeGraphQL<{ user: AuthUserRow | null }>(
    GET_ADMIN_USER_BY_ID,
    { id }
  );
  return mapAuthUserRow(data.user);
}

export async function createAdminUser(
  input: CreateAdminUserInput
): Promise<AdminUser> {
  if (isDevMode()) return createDevAdminUser(input);

  const result = await createAdminUserFromFunction(input);
  return result.user;
}

export async function updateAdminUser(
  id: string,
  input: UpdateAdminUserInput
): Promise<AdminUser> {
  if (isDevMode()) return updateDevAdminUser(id, input);

  const existing = await executeGraphQL<{ user: AuthUserRow | null }>(
    GET_ADMIN_USER_BY_ID,
    { id }
  );
  const current = mapAuthUserRow(existing.user);
  if (!current) {
    throw new Error("Admin user not found");
  }

  const set = buildAuthUserUpdate(input, existing.user ?? undefined);
  if (Object.keys(set).length === 0) {
    return current;
  }

  const data = await executeGraphQL<{ updateUser: AuthUserRow }>(
    UPDATE_ADMIN_USER,
    { id, set }
  );
  const updated = mapAuthUserRow(data.updateUser);
  if (!updated) {
    throw new Error("Failed to update admin user");
  }
  return updated;
}
