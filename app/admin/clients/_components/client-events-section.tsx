import Link from "next/link";
import { CalendarDays, Plus } from "lucide-react";
import type { Client, Event } from "@/lib/types";
import { ClientEventsTable } from "./client-events-table";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ClientEventsSectionProps {
  client: Client;
  events: Event[];
}

function countByStatus(events: Event[], status: Event["status"]) {
  return events.filter((e) => e.status === status).length;
}

export function ClientEventsSection({ client, events }: ClientEventsSectionProps) {
  const liveCount = countByStatus(events, "live");
  const upcomingCount = events.filter(
    (e) => new Date(e.start_time) > new Date() && e.status !== "archived"
  ).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            Event associations
          </CardTitle>
          <CardDescription>
            Events linked to{" "}
            <span className="font-medium text-foreground">{client.name}</span>.
            Each event is owned by this client via{" "}
            <code className="rounded bg-muted px-1 text-xs">client_id</code>.
          </CardDescription>
        </div>
        <Link
          href={`/admin/events/new?clientId=${client.id}`}
          className={buttonVariants({ size: "sm" })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create event
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            {events.length} {events.length === 1 ? "event" : "events"} total
          </Badge>
          {liveCount > 0 && (
            <Badge variant="default">{liveCount} live</Badge>
          )}
          {upcomingCount > 0 && (
            <Badge variant="outline">{upcomingCount} upcoming</Badge>
          )}
        </div>

        <ClientEventsTable
          events={events}
          clientId={client.id}
          clientName={client.name}
        />
      </CardContent>
    </Card>
  );
}
