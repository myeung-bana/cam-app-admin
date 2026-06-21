import "server-only";
import { isDevMode } from "@/lib/dev/config";
import {
  getDevClients,
  getDevClientById,
  createDevClient,
  updateDevClient,
  archiveDevClient,
  getDevEventsByClientId,
} from "@/lib/dev/store";
import { isBackendConfigured } from "@/lib/nhost";
import { requireLiveBackend } from "@/lib/config/backend";
import { executeGraphQL } from "@/lib/graphql/execute";
import {
  GET_CLIENTS,
  GET_CLIENT_BY_ID,
  GET_CLIENT_EVENTS,
} from "@/lib/graphql/clients/queries";
import { UPDATE_CLIENT } from "@/lib/graphql/clients/mutations";
import { createClientFromFunction, resendClientInviteFromFunction } from "@/lib/functions/admin-clients";
import type {
  Client,
  CreateClientInput,
  UpdateClientInput,
  Event,
  EventStatus,
} from "@/lib/types";

interface HasuraEventRow {
  id: string;
  name: string;
  client_id: string;
  event_type: string;
  start_time: string;
  end_time: string;
  max_attendees: number;
  join_code: string;
  status: EventStatus;
  client?: { id: string; name: string; email?: string };
}

function mapEvent(row: HasuraEventRow): Event {
  return {
    id: row.id,
    name: row.name,
    client_id: row.client_id,
    event_type: row.event_type,
    start_time: row.start_time,
    end_time: row.end_time,
    venue_name: null,
    max_attendees: row.max_attendees,
    join_code: row.join_code,
    qr_access_enabled: true,
    status: row.status,
    accent_color: null,
    cover_image_url: null,
    portal_gallery_visible: false,
    reel_shareable: false,
    retention_expires_at: null,
    client: {
      id: row.client?.id ?? row.client_id,
      name: row.client?.name ?? "",
      email: row.client?.email,
    },
  };
}

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

export async function getClientEvents(clientId: string): Promise<Event[]> {
  if (isDevMode()) return getDevEventsByClientId(clientId);
  if (!isBackendConfigured()) return [];
  const data = await executeGraphQL<{ events: HasuraEventRow[] }>(
    GET_CLIENT_EVENTS,
    { clientId }
  );
  return data.events.map(mapEvent);
}

export async function createClient(input: CreateClientInput): Promise<Client> {
  if (isDevMode()) return createDevClient(input);
  requireLiveBackend();

  const result = await createClientFromFunction(input);
  return result.client;
}

export async function updateClient(
  id: string,
  input: UpdateClientInput
): Promise<Client> {
  if (isDevMode()) return updateDevClient(id, input);
  requireLiveBackend();
  const data = await executeGraphQL<{ update_clients_by_pk: Client }>(
    UPDATE_CLIENT,
    { id, set: input }
  );
  return data.update_clients_by_pk;
}

export async function archiveClient(id: string): Promise<Client> {
  if (isDevMode()) return archiveDevClient(id);
  return updateClient(id, { archived: true, status: "archived" });
}

export async function resendClientInvite(clientId: string): Promise<void> {
  if (isDevMode()) return;
  requireLiveBackend();

  await resendClientInviteFromFunction(clientId);
}
