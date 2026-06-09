import { notFound } from "next/navigation";
import { ImageIcon } from "lucide-react";
import { getEventById } from "@/lib/data/events";
import { getEventMedia } from "@/lib/data/media";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { EventNav } from "@/components/shared/event-nav";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ eventId: string }>;
}

export default async function EventMediaPage({ params }: Props) {
  const { eventId } = await params;
  const [event, media] = await Promise.all([
    getEventById(eventId),
    getEventMedia(eventId),
  ]);

  if (!event) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title={event.name} description="Media gallery">
        <div className="flex items-center gap-2">
          <StatusBadge status={event.status} />
          <Button variant="outline" disabled>
            Bulk download
          </Button>
          <Button disabled={event.status !== "ended"}>
            Generate reel
          </Button>
        </div>
      </PageHeader>

      <EventNav eventId={eventId} />

      {media.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No media yet"
          description="Guest uploads will appear here in real time once the event is live."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {media.map((item) => (
            <div
              key={item.id}
              className="aspect-square rounded-lg border bg-muted"
            />
          ))}
        </div>
      )}
    </div>
  );
}
