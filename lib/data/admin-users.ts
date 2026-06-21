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
import type {
  AdminUser,
  CreateAdminUserInput,
  UpdateAdminUserInput,
} from "@/lib/types";

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: AdminUser["role"];
  status: AdminUser["status"];
  phone?: string | null;
  notes?: string | null;
  last_login_at?: string | null;
  created_at: string;
  updated_at?: string;
}

function mapAdminUser(row: AdminUserRow): AdminUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status,
    phone: row.phone ?? null,
    notes: row.notes ?? null,
    last_login_at: row.last_login_at ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  if (isDevMode()) return getDevAdminUsers();
  if (!isBackendConfigured()) return [];
  const data = await executeGraphQL<{ admin_users: AdminUserRow[] }>(
    GET_ADMIN_USERS
  );
  return data.admin_users.map(mapAdminUser);
}

export async function getAdminUserById(id: string): Promise<AdminUser | null> {
  if (isDevMode()) return getDevAdminUserById(id);
  if (!isBackendConfigured()) return null;
  const data = await executeGraphQL<{ admin_users_by_pk: AdminUserRow | null }>(
    GET_ADMIN_USER_BY_ID,
    { id }
  );
  return data.admin_users_by_pk ? mapAdminUser(data.admin_users_by_pk) : null;
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
  const data = await executeGraphQL<{ update_admin_users_by_pk: AdminUserRow }>(
    UPDATE_ADMIN_USER,
    { id, set: input }
  );
  return mapAdminUser(data.update_admin_users_by_pk);
}
