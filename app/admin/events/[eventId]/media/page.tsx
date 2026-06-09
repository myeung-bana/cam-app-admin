import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventById } from "@/lib/data/events";
import { getEventMedia } from "@/lib/data/media";
import { EntityHeader } from "@/components/shared/entity-header";
import { EventStatusBadge } from "@/components/shared/status-badge";
import { EventNav } from "@/components/shared/event-nav";
import { MediaGrid } from "@/components/shared/media-grid";
import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ImageIcon } from "lucide-react";

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

  const storagePct = Math.min((media.length / 200) * 100, 100);

  return (
    <div className="space-y-6">
      <EntityHeader
        breadcrumbs={[
          { label: "Events", href: "/admin/events" },
          { label: event.name, href: `/admin/events/${eventId}` },
          { label: "Media" },
        ]}
        title={event.name}
        badge={<EventStatusBadge status={event.status} />}
        description="Media gallery"
      >
        <div className="flex gap-2">
          <button className={buttonVariants({ variant: "outline", size: "sm" })} disabled>
            Bulk download
          </button>
          <Link
            href={`/admin/events/${eventId}/reel`}
            className={buttonVariants({
              size: "sm",
              variant: event.status === "ended" || event.status === "archived" ? "default" : "outline",
            })}
          >
            {event.status === "ended" || event.status === "archived"
              ? "Generate reel"
              : "Reel (after event)"}
          </Link>
        </div>
      </EntityHeader>

      <EventNav eventId={eventId} status={event.status} />

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Storage usage</span>
          <span>{media.length} files · ~{(media.length * 0.05).toFixed(1)} GB</span>
        </div>
        <Progress value={storagePct} />
      </div>

      {media.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No media yet"
          description="Guest uploads will appear here once the event is live."
        />
      ) : (
        <MediaGrid eventId={eventId} media={media} />
      )}
    </div>
  );
}
