import "server-only";
import { isDevMode } from "@/lib/dev/config";
import { getDevDashboard, updateDevDashboard } from "@/lib/dev/store";
import { isBackendConfigured } from "@/lib/nhost";
import type { DashboardConfig } from "@/lib/types";

const DEFAULT_DASHBOARD: DashboardConfig = {
  title: "Dashboard",
  description: "Overview of your wedding capture events.",
  activeEventsToday: 0,
  totalUploadsToday: 0,
  liveSessionsOnline: 0,
};

export async function getDashboardConfig(): Promise<DashboardConfig> {
  if (isDevMode()) {
    return getDevDashboard();
  }

  if (!isBackendConfigured()) {
    return DEFAULT_DASHBOARD;
  }

  return DEFAULT_DASHBOARD;
}

export async function saveDashboardConfig(
  updates: Partial<DashboardConfig>
): Promise<DashboardConfig> {
  if (isDevMode()) {
    return updateDevDashboard(updates);
  }

  throw new Error("Dashboard editing requires dev mode or a connected backend.");
}
