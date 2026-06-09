import "server-only";
import { isDevMode } from "@/lib/dev/config";
import {
  getDevEvents,
  getDevEventById,
  createDevEvent,
  updateDevEvent,
  getDevDashboard,
} from "@/lib/dev/store";
import { isBackendConfigured } from "@/lib/nhost";
import { executeGraphQL } from "@/lib/graphql/execute";
import { GET_EVENTS, GET_EVENT_BY_ID } from "@/lib/graphql/events/queries";
import { INSERT_EVENT, UPDATE_EVENT } from "@/lib/graphql/events/mutations";
import type {
  Event,
  CreateEventInput,
  UpdateEventInput,
  DashboardStats,
} from "@/lib/types";

export async function getEvents(): Promise<Event[]> {
  if (isDevMode()) return getDevEvents();
  if (!isBackendConfigured()) return [];

  const data = await executeGraphQL<{ events: Event[] }>(GET_EVENTS);
  return data.events;
}

export async function getEventById(id: string): Promise<Event | null> {
  if (isDevMode()) return getDevEventById(id);
  if (!isBackendConfigured()) return null;

  const data = await executeGraphQL<{ events_by_pk: Event | null }>(
    GET_EVENT_BY_ID,
    { id }
  );
  return data.events_by_pk;
}

export async function createEvent(input: CreateEventInput): Promise<Event> {
  if (isDevMode()) return createDevEvent(input);

  const data = await executeGraphQL<{ insert_events_one: Event }>(
    INSERT_EVENT,
    { object: { ...input, status: "draft" } }
  );
  return data.insert_events_one;
}

export async function updateEvent(
  id: string,
  input: UpdateEventInput
): Promise<Event> {
  if (isDevMode()) return updateDevEvent(id, input);

  const data = await executeGraphQL<{ update_events_by_pk: Event }>(
    UPDATE_EVENT,
    { id, set: input }
  );
  return data.update_events_by_pk;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (isDevMode()) {
    const config = getDevDashboard();
    return {
      activeEventsToday: config.activeEventsToday,
      totalUploadsToday: config.totalUploadsToday,
      liveSessionsOnline: config.liveSessionsOnline,
    };
  }

  return {
    activeEventsToday: 0,
    totalUploadsToday: 0,
    liveSessionsOnline: 0,
  };
}
