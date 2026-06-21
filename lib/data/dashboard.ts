import "server-only";
import { isDevMode } from "@/lib/dev/config";
import {
  getDevDashboard,
  updateDevDashboard,
  getDevUpcomingEvents,
  getDevActivity,
} from "@/lib/dev/store";
import { isBackendConfigured } from "@/lib/nhost";
import { executeGraphQL } from "@/lib/graphql/execute";
import {
  GET_DASHBOARD_METRICS,
  GET_UPCOMING_EVENTS,
  GET_RECENT_ACTIVITY,
} from "@/lib/graphql/dashboard/queries";
import type { DashboardConfig, Event, ActivityLogEntry, EventStatus } from "@/lib/types";

const DEFAULT_DASHBOARD: DashboardConfig = {
  title: "Dashboard",
  description: "Operational overview across all Memo clients and events.",
  activeEventsToday: 0,
  uploadsThisWeek: 0,
  clientsOnboarded: 0,
  reelsDelivered: 0,
};

interface HasuraEventRow {
  id: string;
  name: string;
  client_id: string;
  start_time: string;
  status: EventStatus;
  client?: { id: string; name: string; email?: string };
}

function mapEvent(row: HasuraEventRow): Event {
  return {
    id: row.id,
    name: row.name,
    client_id: row.client_id,
    event_type: "",
    start_time: row.start_time,
    end_time: row.start_time,
    venue_name: null,
    max_attendees: 0,
    join_code: "",
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

export async function getDashboardConfig(): Promise<DashboardConfig> {
  if (isDevMode()) return getDevDashboard();
  if (!isBackendConfigured()) return DEFAULT_DASHBOARD;

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const data = await executeGraphQL<{
    live_events: { aggregate: { count: number } };
    uploads_week: { aggregate: { count: number } };
    clients_active: { aggregate: { count: number } };
    reels_delivered: { aggregate: { count: number } };
  }>(GET_DASHBOARD_METRICS, { weekAgo });

  return {
    ...DEFAULT_DASHBOARD,
    activeEventsToday: data.live_events.aggregate.count ?? 0,
    uploadsThisWeek: data.uploads_week.aggregate.count ?? 0,
    clientsOnboarded: data.clients_active.aggregate.count ?? 0,
    reelsDelivered: data.reels_delivered.aggregate.count ?? 0,
  };
}

export async function saveDashboardConfig(
  updates: Partial<DashboardConfig>
): Promise<DashboardConfig> {
  if (isDevMode()) return updateDevDashboard(updates);
  const current = await getDashboardConfig();
  return { ...current, ...updates };
}

export async function getUpcomingEvents(days = 7): Promise<Event[]> {
  if (isDevMode()) return getDevUpcomingEvents(days);
  if (!isBackendConfigured()) return [];

  const from = new Date().toISOString();
  const to = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
  const data = await executeGraphQL<{ events: HasuraEventRow[] }>(
    GET_UPCOMING_EVENTS,
    { from, to }
  );
  return data.events.map(mapEvent);
}

export async function getRecentActivity(
  limit = 10
): Promise<ActivityLogEntry[]> {
  if (isDevMode()) return getDevActivity(limit);
  if (!isBackendConfigured()) return [];

  const data = await executeGraphQL<{ activity_log: ActivityLogEntry[] }>(
    GET_RECENT_ACTIVITY,
    { limit }
  );
  return data.activity_log;
}
