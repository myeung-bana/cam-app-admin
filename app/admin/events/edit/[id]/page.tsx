import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getClients } from "@/lib/data/clients";
import { getEventById } from "@/lib/data/events";
import { getEventTypeOptions } from "@/lib/data/taxonomy";
import { EntityHeader } from "@/components/shared/entity-header";
import { EventStatusBadge } from "@/components/shared/status-badge";
import { EventForm } from "../../_components/event-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;
  const [event, clients, eventTypeOptions] = await Promise.all([
    getEventById(id),
    getClients(),
    getEventTypeOptions(),
  ]);

  if (!event) notFound();

  return (
    <div className="space-y-6">
      <EntityHeader
        breadcrumbs={[
          { label: "Events", href: "/admin/events" },
          { label: event.name, href: `/admin/events/${id}` },
          { label: "Edit" },
        ]}
        title="Edit event"
        description={`Update details for ${event.name}.`}
        badge={<EventStatusBadge status={event.status} />}
      />
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
        <EventForm clients={clients} eventTypeOptions={eventTypeOptions} event={event} />
      </Suspense>
    </div>
  );
}
