import "server-only";
import { isDevMode } from "@/lib/dev/config";
import {
  getDevClients,
  getDevClientById,
  createDevClient,
  updateDevClient,
} from "@/lib/dev/store";
import { isBackendConfigured } from "@/lib/nhost";
import { executeGraphQL } from "@/lib/graphql/execute";
import { GET_CLIENTS, GET_CLIENT_BY_ID } from "@/lib/graphql/clients/queries";
import {
  INSERT_CLIENT,
  UPDATE_CLIENT,
} from "@/lib/graphql/clients/mutations";
import type {
  Client,
  CreateClientInput,
  UpdateClientInput,
} from "@/lib/types";

export async function getClients(): Promise<Client[]> {
  if (isDevMode()) return getDevClients();
  if (!isBackendConfigured()) return [];

  const data = await executeGraphQL<{ clients: Client[] }>(GET_CLIENTS);
  return data.clients;
}

export async function getClientById(id: string): Promise<Client | null> {
  if (isDevMode()) return getDevClientById(id);
  if (!isBackendConfigured()) return null;

  const data = await executeGraphQL<{ clients_by_pk: Client | null }>(
    GET_CLIENT_BY_ID,
    { id }
  );
  return data.clients_by_pk;
}

export async function createClient(input: CreateClientInput): Promise<Client> {
  if (isDevMode()) return createDevClient(input);

  const data = await executeGraphQL<{ insert_clients_one: Client }>(
    INSERT_CLIENT,
    { object: input }
  );
  return data.insert_clients_one;
}

export async function updateClient(
  id: string,
  input: UpdateClientInput
): Promise<Client> {
  if (isDevMode()) return updateDevClient(id, input);

  const data = await executeGraphQL<{ update_clients_by_pk: Client }>(
    UPDATE_CLIENT,
    { id, set: input }
  );
  return data.update_clients_by_pk;
}
