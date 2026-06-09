import Link from "next/link";
import { getEvents } from "@/lib/data/events";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { EventTable } from "./_components/event-table";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description="Configure, operate, and deliver events across all clients."
      >
        <Link href="/admin/events/new" className={buttonVariants()}>
          Create event
        </Link>
      </PageHeader>

      <EventTable events={events} />
    </div>
  );
}
