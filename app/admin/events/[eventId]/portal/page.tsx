import { notFound } from "next/navigation";
import { getEventById } from "@/lib/data/events";
import { getClientById } from "@/lib/data/clients";
import { EntityHeader } from "@/components/shared/entity-header";
import { EventStatusBadge } from "@/components/shared/status-badge";
import { EventNav } from "@/components/shared/event-nav";
import { PortalControls } from "@/components/shared/portal-controls";

interface Props {
  params: Promise<{ eventId: string }>;
}

export default async function EventPortalPage({ params }: Props) {
  const { eventId } = await params;
  const event = await getEventById(eventId);

  if (!event) notFound();

  const client = await getClientById(event.client_id);

  return (
    <div className="space-y-6">
      <EntityHeader
        breadcrumbs={[
          { label: "Events", href: "/admin/events" },
          { label: event.name, href: `/admin/events/${eventId}` },
          { label: "Portal" },
        ]}
        title={event.name}
        badge={<EventStatusBadge status={event.status} />}
        description="Client portal delivery"
      />

      <EventNav eventId={eventId} status={event.status} />

      <PortalControls event={event} client={client} />
    </div>
  );
}
