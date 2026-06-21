import "server-only";
import { callAdminFunction } from "@/lib/functions/client";
import { getActingAdminUserId } from "@/lib/functions/admin-call-context";
import type { AdminUser, CreateAdminUserInput } from "@/lib/types";

export interface CreateAdminUserResult {
  user: AdminUser;
  inviteSent: boolean;
}

export async function createAdminUserFromFunction(
  input: CreateAdminUserInput
): Promise<CreateAdminUserResult> {
  return callAdminFunction<CreateAdminUserResult>("/admin/users/create", {
    method: "POST",
    body: input,
    actingAdminUserId: await getActingAdminUserId(),
  });
}
