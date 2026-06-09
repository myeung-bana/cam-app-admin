import { getClients } from "@/lib/data/clients";
import { PageHeader } from "@/components/shared/page-header";
import { EventForm } from "../_components/event-form";

export default async function NewEventPage() {
  const clients = await getClients();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create event"
        description="Set up a new wedding event and generate a QR code."
      />
      <EventForm clients={clients} />
    </div>
  );
}
