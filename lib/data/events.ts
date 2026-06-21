import "server-only";
import { isDevMode } from "@/lib/dev/config";
import {
  getDevEvents,
  getDevEventById,
  createDevEvent,
  updateDevEvent,
  transitionDevEventStatus,
  getDevDashboard,
  rotateDevJoinCode,
} from "@/lib/dev/store";
import { isBackendConfigured } from "@/lib/nhost";
import { executeGraphQL } from "@/lib/graphql/execute";
import { GET_EVENTS, GET_EVENT_BY_ID } from "@/lib/graphql/events/queries";
import {
  INSERT_EVENT,
  UPDATE_EVENT,
  ROTATE_JOIN_CODE,
} from "@/lib/graphql/events/mutations";
import { generateJoinCode } from "@/lib/utils/join-code";
import { getDashboardConfig } from "@/lib/data/dashboard";
import type {
  Event,
  CreateEventInput,
  UpdateEventInput,
  EventStatus,
  DashboardStats,
} from "@/lib/types";

interface HasuraEventRow {
  id: string;
  name: string;
  client_id: string;
  event_type: string;
  start_time: string;
  end_time: string;
  venue_name?: string | null;
  max_attendees: number;
  join_code: string;
  qr_access_enabled?: boolean;
  join_code_rotated_at?: string | null;
  status: EventStatus;
  accent_color?: string | null;
  cover_image_url?: string | null;
  portal_gallery_visible?: boolean;
  reel_shareable?: boolean;
  retention_expires_at?: string | null;
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
    venue_name: row.venue_name ?? null,
    max_attendees: row.max_attendees,
    join_code: row.join_code,
    qr_access_enabled: row.qr_access_enabled ?? true,
    join_code_rotated_at: row.join_code_rotated_at ?? null,
    status: row.status,
    accent_color: row.accent_color ?? null,
    cover_image_url: row.cover_image_url ?? null,
    portal_gallery_visible: row.portal_gallery_visible ?? false,
    reel_shareable: row.reel_shareable ?? false,
    retention_expires_at: row.retention_expires_at ?? null,
    client: {
      id: row.client?.id ?? row.client_id,
      name: row.client?.name ?? "",
      email: row.client?.email,
    },
  };
}

export async function getEvents(): Promise<Event[]> {
  if (isDevMode()) return getDevEvents();
  if (!isBackendConfigured()) return [];
  const data = await executeGraphQL<{ events: HasuraEventRow[] }>(GET_EVENTS);
  return data.events.map(mapEvent);
}

export async function getEventById(id: string): Promise<Event | null> {
  if (isDevMode()) return getDevEventById(id);
  if (!isBackendConfigured()) return null;
  const data = await executeGraphQL<{ events_by_pk: HasuraEventRow | null }>(
    GET_EVENT_BY_ID,
    { id }
  );
  return data.events_by_pk ? mapEvent(data.events_by_pk) : null;
}

export async function createEvent(input: CreateEventInput): Promise<Event> {
  if (isDevMode()) return createDevEvent(input);
  const data = await executeGraphQL<{ insert_events_one: HasuraEventRow }>(
    INSERT_EVENT,
    {
      object: {
        ...input,
        join_code: generateJoinCode(),
        status: "draft",
      },
    }
  );
  return mapEvent(data.insert_events_one);
}

export async function updateEvent(
  id: string,
  input: UpdateEventInput
): Promise<Event> {
  if (isDevMode()) return updateDevEvent(id, input);
  const data = await executeGraphQL<{ update_events_by_pk: HasuraEventRow }>(
    UPDATE_EVENT,
    { id, set: input }
  );
  return mapEvent(data.update_events_by_pk);
}

export async function transitionEventStatus(
  id: string,
  status: EventStatus
): Promise<Event> {
  if (isDevMode()) return transitionDevEventStatus(id, status);
  return updateEvent(id, { status });
}

export async function rotateEventJoinCode(eventId: string): Promise<Event> {
  if (isDevMode()) return rotateDevJoinCode(eventId);
  const joinCode = generateJoinCode();
  const data = await executeGraphQL<{ update_events_by_pk: HasuraEventRow }>(
    ROTATE_JOIN_CODE,
    { id: eventId, joinCode, rotatedAt: new Date().toISOString() }
  );
  return mapEvent(data.update_events_by_pk);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (isDevMode()) {
    const config = getDevDashboard();
    return {
      activeEventsToday: config.activeEventsToday,
      uploadsThisWeek: config.uploadsThisWeek,
      clientsOnboarded: config.clientsOnboarded,
      reelsDelivered: config.reelsDelivered,
    };
  }
  const config = await getDashboardConfig();
  return {
    activeEventsToday: config.activeEventsToday,
    uploadsThisWeek: config.uploadsThisWeek,
    clientsOnboarded: config.clientsOnboarded,
    reelsDelivered: config.reelsDelivered,
  };
}
