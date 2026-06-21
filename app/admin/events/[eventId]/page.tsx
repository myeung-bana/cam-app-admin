import { notFound } from "next/navigation";
import { getEventById } from "@/lib/data/events";
import { EntityHeader } from "@/components/shared/entity-header";
import { EventStatusBadge } from "@/components/shared/status-badge";
import { QrDisplay } from "@/components/shared/qr-display";
import { EventNav } from "@/components/shared/event-nav";
import { formatDateTime } from "@/lib/utils/format";
import { EventStatusActions } from "../_components/event-status-actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  params: Promise<{ eventId: string }>;
}

export default async function EventDetailPage({ params }: Props) {
  const { eventId } = await params;
  const event = await getEventById(eventId);

  if (!event) notFound();

  return (
    <div className="space-y-6">
      <EntityHeader
        breadcrumbs={[
          { label: "Events", href: "/admin/events" },
          { label: event.name },
        ]}
        title={event.name}
        badge={<EventStatusBadge status={event.status} />}
        description={event.client.name}
      >
        <EventStatusActions eventId={eventId} status={event.status} />
      </EntityHeader>

      <EventNav eventId={eventId} status={event.status} />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Event details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium capitalize">{event.event_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <EventStatusBadge status={event.status} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Start</p>
              <p className="font-medium">{formatDateTime(event.start_time)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">End</p>
              <p className="font-medium">{formatDateTime(event.end_time)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Venue</p>
              <p className="font-medium">{event.venue_name ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Attendee cap</p>
              <p className="font-medium">{event.max_attendees}</p>
            </div>
            {event.accent_color && (
              <div>
                <p className="text-sm text-muted-foreground">Accent colour</p>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-5 w-5 rounded border"
                    style={{ backgroundColor: event.accent_color }}
                  />
                  <span className="font-medium">{event.accent_color}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <QrDisplay joinCode={event.join_code} eventId={eventId} />
      </div>
    </div>
  );
}
