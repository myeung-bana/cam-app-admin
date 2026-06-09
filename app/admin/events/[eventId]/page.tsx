import { notFound } from "next/navigation";
import { getEventById } from "@/lib/data/events";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { QrDisplay } from "@/components/shared/qr-display";
import { EventNav } from "@/components/shared/event-nav";
import { formatDateTime } from "@/lib/utils/format";
import { LiveSessionCount } from "./_components/live-session-count";
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
      <PageHeader title={event.name} description={event.client.name}>
        <StatusBadge status={event.status} />
      </PageHeader>

      <LiveSessionCount eventId={eventId} max={event.max_attendees} />

      <EventNav eventId={eventId} />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Event details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
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
          </CardContent>
        </Card>

        <QrDisplay imageUrl={event.qr_image_url} eventId={eventId} />
      </div>
    </div>
  );
}
