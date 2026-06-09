import { CalendarDays, Image, Users } from "lucide-react";
import { getDashboardConfig } from "@/lib/data/dashboard";
import { isDevMode } from "@/lib/dev/config";
import { isBackendConfigured } from "@/lib/nhost";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardEditor } from "./_components/dashboard-editor";

export default async function DashboardPage() {
  const config = await getDashboardConfig();
  const devMode = isDevMode();
  const backendReady = isBackendConfigured();

  const metrics = [
    {
      title: "Active events today",
      value: config.activeEventsToday,
      description: "Events currently in progress",
      icon: CalendarDays,
    },
    {
      title: "Uploads today",
      value: config.totalUploadsToday,
      description: "Photos and videos uploaded",
      icon: Image,
    },
    {
      title: "Live sessions",
      value: config.liveSessionsOnline,
      description: "Guests online right now",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={config.title} description={config.description}>
        {devMode && <DashboardEditor config={config} />}
      </PageHeader>

      {devMode && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-sm text-amber-900">
          You are in dev mode with seeded mock data. Use{" "}
          <strong>Edit dashboard</strong> to change the heading and metrics.
          Client and event forms also persist to{" "}
          <code className="rounded bg-amber-100 px-1">.data/dev-store.json</code>.
        </div>
      )}

      {!devMode && !backendReady && (
        <div className="rounded-lg border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground">
          Nhost is not configured yet. Copy{" "}
          <code className="rounded bg-muted px-1">.env.example</code> to{" "}
          <code className="rounded bg-muted px-1">.env.local</code> and add
          your project credentials from cam-app-nhost.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <CardDescription className="mt-1">
                  {metric.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
