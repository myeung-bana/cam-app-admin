import { notFound } from "next/navigation";
import { Trophy } from "lucide-react";
import { getEventById } from "@/lib/data/events";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { EventNav } from "@/components/shared/event-nav";

interface Props {
  params: Promise<{ eventId: string }>;
}

export default async function EventChallengesPage({ params }: Props) {
  const { eventId } = await params;
  const event = await getEventById(eventId);

  if (!event) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title={event.name} description="Event challenges">
        <StatusBadge status={event.status} />
      </PageHeader>

      <EventNav eventId={eventId} />

      <EmptyState
        icon={Trophy}
        title="No challenges configured"
        description="Add photo challenges for guests to complete during the event."
      />
    </div>
  );
}
