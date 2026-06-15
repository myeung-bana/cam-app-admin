import "server-only";
import { isDevMode } from "@/lib/dev/config";
import {
  getDevAdminUsers,
  getDevAdminUserById,
  createDevAdminUser,
  updateDevAdminUser,
} from "@/lib/dev/store";
import { isBackendConfigured } from "@/lib/nhost";
import type {
  AdminUser,
  CreateAdminUserInput,
  UpdateAdminUserInput,
} from "@/lib/types";

export async function getAdminUsers(): Promise<AdminUser[]> {
  if (isDevMode()) return getDevAdminUsers();
  if (!isBackendConfigured()) return [];
  return [];
}

export async function getAdminUserById(id: string): Promise<AdminUser | null> {
  if (isDevMode()) return getDevAdminUserById(id);
  if (!isBackendConfigured()) return null;
  return null;
}

export async function createAdminUser(
  input: CreateAdminUserInput
): Promise<AdminUser> {
  if (isDevMode()) return createDevAdminUser(input);
  throw new Error("Admin user creation requires dev mode or a connected backend.");
}

export async function updateAdminUser(
  id: string,
  input: UpdateAdminUserInput
): Promise<AdminUser> {
  if (isDevMode()) return updateDevAdminUser(id, input);
  throw new Error("Admin user updates require dev mode or a connected backend.");
}
