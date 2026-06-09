import { notFound } from "next/navigation";
import { Radio, HardDrive, Upload } from "lucide-react";
import { getEventById } from "@/lib/data/events";
import { getEventMedia } from "@/lib/data/media";
import { getEventChallenges } from "@/lib/data/challenges";
import { EntityHeader } from "@/components/shared/entity-header";
import { EventStatusBadge } from "@/components/shared/status-badge";
import { EventNav } from "@/components/shared/event-nav";
import { EmptyState } from "@/components/shared/empty-state";
import { MetricCard } from "@/components/shared/metric-card";
import { EventStatusActions } from "../../_components/event-status-actions";
import { LiveSessionCount } from "../_components/live-session-count";
import { LiveUploadFeed } from "../_components/live-upload-feed";
import { ChallengeHeatmap } from "../_components/challenge-heatmap";
import { CapControl } from "../_components/cap-control";

interface Props {
  params: Promise<{ eventId: string }>;
}

export default async function EventLivePage({ params }: Props) {
  const { eventId } = await params;
  const [event, media, challenges] = await Promise.all([
    getEventById(eventId),
    getEventMedia(eventId),
    getEventChallenges(eventId),
  ]);

  if (!event) notFound();

  if (event.status !== "live") {
    return (
      <div className="space-y-6">
        <EntityHeader
          breadcrumbs={[
            { label: "Events", href: "/admin/events" },
            { label: event.name, href: `/admin/events/${eventId}` },
            { label: "Live" },
          ]}
          title={event.name}
          badge={<EventStatusBadge status={event.status} />}
        />
        <EventNav eventId={eventId} status={event.status} />
        <EmptyState
          icon={Radio}
          title="Live dashboard locked"
          description="The live operations dashboard is available when the event status is Live."
        />
      </div>
    );
  }

  const uploadsLastHour = media.filter((m) => {
    const uploaded = new Date(m.uploaded_at).getTime();
    return Date.now() - uploaded < 60 * 60 * 1000;
  }).length;

  return (
    <div className="space-y-6">
      <EntityHeader
        breadcrumbs={[
          { label: "Events", href: "/admin/events" },
          { label: event.name, href: `/admin/events/${eventId}` },
          { label: "Live" },
        ]}
        title={event.name}
        badge={<EventStatusBadge status={event.status} />}
        description="Real-time operations"
      >
        <EventStatusActions eventId={eventId} status={event.status} />
      </EntityHeader>

      <EventNav eventId={eventId} status={event.status} />

      <div className="grid gap-4 md:grid-cols-3">
        <LiveSessionCount eventId={eventId} max={event.max_attendees} />
        <MetricCard
          title="Uploads / hour"
          value={uploadsLastHour}
          description="Last 60 minutes"
          icon={Upload}
        />
        <MetricCard
          title="Storage used"
          value={`${(media.length * 0.05).toFixed(1)} GB`}
          description="Estimated from uploads"
          icon={HardDrive}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LiveUploadFeed eventId={eventId} media={media} />
        </div>
        <ChallengeHeatmap challenges={challenges} media={media} />
      </div>

      <CapControl eventId={eventId} currentCap={event.max_attendees} />
    </div>
  );
}
