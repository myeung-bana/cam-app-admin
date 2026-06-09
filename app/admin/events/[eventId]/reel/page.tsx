import { notFound } from "next/navigation";
import { Film } from "lucide-react";
import { getEventById } from "@/lib/data/events";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { EventNav } from "@/components/shared/event-nav";

interface Props {
  params: Promise<{ eventId: string }>;
}

export default async function EventReelPage({ params }: Props) {
  const { eventId } = await params;
  const event = await getEventById(eventId);

  if (!event) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title={event.name} description="AI highlight reel">
        <StatusBadge status={event.status} />
      </PageHeader>

      <EventNav eventId={eventId} />

      <EmptyState
        icon={Film}
        title="No reel generated"
        description="After the event ends, generate an AI-powered highlight reel from guest uploads."
      />
    </div>
  );
}
