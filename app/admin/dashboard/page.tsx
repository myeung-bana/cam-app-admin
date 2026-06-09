import {
  CalendarDays,
  Clapperboard,
  Image,
  Users,
} from "lucide-react";
import { getDashboardConfig, getUpcomingEvents, getRecentActivity } from "@/lib/data/dashboard";
import { isDevMode } from "@/lib/dev/config";
import { isBackendConfigured } from "@/lib/nhost";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { UpcomingEventsTable } from "@/components/shared/upcoming-events-table";
import { ActivityFeed } from "@/components/shared/activity-feed";
import { DashboardEditor } from "./_components/dashboard-editor";

export default async function DashboardPage() {
  const [config, upcoming, activity] = await Promise.all([
    getDashboardConfig(),
    getUpcomingEvents(7),
    getRecentActivity(10),
  ]);
  const devMode = isDevMode();
  const backendReady = isBackendConfigured();

  const metrics = [
    {
      title: "Active events today",
      value: config.activeEventsToday,
      description: "Events currently live",
      icon: CalendarDays,
    },
    {
      title: "Uploads this week",
      value: config.uploadsThisWeek,
      description: "Photos and videos uploaded",
      icon: Image,
    },
    {
      title: "Clients onboarded",
      value: config.clientsOnboarded,
      description: "Total active client accounts",
      icon: Users,
    },
    {
      title: "Reels delivered",
      value: config.reelsDelivered,
      description: "Published to client portals",
      icon: Clapperboard,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={config.title} description={config.description}>
        {devMode && <DashboardEditor config={config} />}
      </PageHeader>

      {devMode && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-sm text-amber-900">
          Memo dev mode — mock data persisted to{" "}
          <code className="rounded bg-amber-100 px-1">.data/dev-store.json</code>
        </div>
      )}

      {!devMode && !backendReady && (
        <div className="rounded-lg border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground">
          Connect Nhost or enable dev mode to load live data.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UpcomingEventsTable events={upcoming} />
        </div>
        <ActivityFeed entries={activity} />
      </div>
    </div>
  );
}
