import { notFound } from "next/navigation";
import { getEventById } from "@/lib/data/events";
import { getEventChallenges } from "@/lib/data/challenges";
import { EntityHeader } from "@/components/shared/entity-header";
import { EventStatusBadge } from "@/components/shared/status-badge";
import { EventNav } from "@/components/shared/event-nav";
import { ChallengeBuilder } from "@/components/shared/challenge-builder";

interface Props {
  params: Promise<{ eventId: string }>;
}

export default async function EventChallengesPage({ params }: Props) {
  const { eventId } = await params;
  const [event, challenges] = await Promise.all([
    getEventById(eventId),
    getEventChallenges(eventId),
  ]);

  if (!event) notFound();

  return (
    <div className="space-y-6">
      <EntityHeader
        breadcrumbs={[
          { label: "Events", href: "/admin/events" },
          { label: event.name, href: `/admin/events/${eventId}` },
          { label: "Challenges" },
        ]}
        title={event.name}
        badge={<EventStatusBadge status={event.status} />}
        description="Photo challenges for guests"
      />

      <EventNav eventId={eventId} status={event.status} />

      <ChallengeBuilder
        eventId={eventId}
        eventType={event.event_type}
        initialChallenges={challenges}
      />
    </div>
  );
}
