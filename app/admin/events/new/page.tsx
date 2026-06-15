import { Suspense } from "react";
import { getClients } from "@/lib/data/clients";
import { getEventTypeOptions } from "@/lib/data/taxonomy";
import { EntityHeader } from "@/components/shared/entity-header";
import { EventForm } from "../_components/event-form";

export default async function NewEventPage() {
  const [clients, eventTypeOptions] = await Promise.all([
    getClients(),
    getEventTypeOptions(),
  ]);

  return (
    <div className="space-y-6">
      <EntityHeader
        breadcrumbs={[
          { label: "Events", href: "/admin/events" },
          { label: "Create event" },
        ]}
        title="Create event"
        description="Configure basics and branding, then set up challenges from the event workspace."
      />
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
        <EventForm clients={clients} eventTypeOptions={eventTypeOptions} />
      </Suspense>
    </div>
  );
}
