import { notFound } from "next/navigation";
import { getEventById } from "@/lib/data/events";
import { getEventReel } from "@/lib/data/reels";
import { EntityHeader } from "@/components/shared/entity-header";
import { EventStatusBadge } from "@/components/shared/status-badge";
import { EventNav } from "@/components/shared/event-nav";
import { ReelPanel } from "../../_components/reel-panel";

interface Props {
  params: Promise<{ eventId: string }>;
}

export default async function EventReelPage({ params }: Props) {
  const { eventId } = await params;
  const [event, reel] = await Promise.all([
    getEventById(eventId),
    getEventReel(eventId),
  ]);

  if (!event) notFound();

  return (
    <div className="space-y-6">
      <EntityHeader
        breadcrumbs={[
          { label: "Events", href: "/admin/events" },
          { label: event.name, href: `/admin/events/${eventId}` },
          { label: "Reel" },
        ]}
        title={event.name}
        badge={<EventStatusBadge status={event.status} />}
        description="AI highlight reel"
      />

      <EventNav eventId={eventId} status={event.status} />

      <ReelPanel event={event} reel={reel} />
    </div>
  );
}
