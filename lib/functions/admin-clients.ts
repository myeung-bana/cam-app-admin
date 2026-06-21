import "server-only";
import { callAdminFunction } from "@/lib/functions/client";
import { getActingAdminUserId } from "@/lib/functions/admin-call-context";
import type { Client, CreateClientInput } from "@/lib/types";

export interface CreateClientResult {
  client: Client;
  inviteSent: boolean;
}

export async function createClientFromFunction(
  input: CreateClientInput
): Promise<CreateClientResult> {
  return callAdminFunction<CreateClientResult>("/admin/clients/create", {
    method: "POST",
    body: input,
    actingAdminUserId: await getActingAdminUserId(),
  });
}

export async function resendClientInviteFromFunction(
  clientId: string
): Promise<{ clientId: string; inviteSent: boolean }> {
  return callAdminFunction("/admin/clients/resend-invite", {
    method: "POST",
    query: { clientId },
    actingAdminUserId: await getActingAdminUserId(),
  });
}
