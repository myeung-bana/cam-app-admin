import "server-only";
import { isDevMode } from "@/lib/dev/config";
import {
  getDevDashboard,
  updateDevDashboard,
  getDevUpcomingEvents,
  getDevActivity,
} from "@/lib/dev/store";
import { isBackendConfigured } from "@/lib/nhost";
import type { DashboardConfig, Event, ActivityLogEntry } from "@/lib/types";

const DEFAULT_DASHBOARD: DashboardConfig = {
  title: "Dashboard",
  description: "Operational overview across all Memo clients and events.",
  activeEventsToday: 0,
  uploadsThisWeek: 0,
  clientsOnboarded: 0,
  reelsDelivered: 0,
};

export async function getDashboardConfig(): Promise<DashboardConfig> {
  if (isDevMode()) return getDevDashboard();
  if (!isBackendConfigured()) return DEFAULT_DASHBOARD;
  return DEFAULT_DASHBOARD;
}

export async function saveDashboardConfig(
  updates: Partial<DashboardConfig>
): Promise<DashboardConfig> {
  if (isDevMode()) return updateDevDashboard(updates);
  throw new Error("Dashboard editing requires dev mode or a connected backend.");
}

export async function getUpcomingEvents(days = 7): Promise<Event[]> {
  if (isDevMode()) return getDevUpcomingEvents(days);
  return [];
}

export async function getRecentActivity(
  limit = 10
): Promise<ActivityLogEntry[]> {
  if (isDevMode()) return getDevActivity(limit);
  return [];
}
