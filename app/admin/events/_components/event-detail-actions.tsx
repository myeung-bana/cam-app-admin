import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { EventStatus } from "@/lib/types";
import { EventStatusActions } from "./event-status-actions";

interface EventDetailActionsProps {
  eventId: string;
  status: EventStatus;
}

export function EventDetailActions({ eventId, status }: EventDetailActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/admin/events/edit/${eventId}`}
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        Edit
      </Link>
      <EventStatusActions eventId={eventId} status={status} />
    </div>
  );
}
