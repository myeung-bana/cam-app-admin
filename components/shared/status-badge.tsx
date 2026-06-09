import { Badge } from "@/components/ui/badge";
import type { EventStatus, ClientStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const EVENT_STATUS: Record<
  EventStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  draft: { label: "Draft", variant: "secondary" },
  ready: { label: "Ready", variant: "outline" },
  live: { label: "Live", variant: "default" },
  ended: { label: "Ended", variant: "outline" },
  archived: { label: "Archived", variant: "destructive" },
};

const CLIENT_STATUS: Record<
  ClientStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  invited: { label: "Invited", variant: "secondary" },
  portal_active: { label: "Portal Active", variant: "default" },
  event_completed: { label: "Event Completed", variant: "outline" },
  archived: { label: "Archived", variant: "destructive" },
};

interface StatusBadgeProps {
  status: EventStatus | ClientStatus;
  type?: "event" | "client";
  className?: string;
}

export function StatusBadge({ status, type = "event", className }: StatusBadgeProps) {
  const config =
    type === "client"
      ? (CLIENT_STATUS[status as ClientStatus] ?? CLIENT_STATUS.invited)
      : (EVENT_STATUS[status as EventStatus] ?? EVENT_STATUS.draft);

  return (
    <Badge variant={config.variant} className={cn(className)}>
      {config.label}
    </Badge>
  );
}

export function EventStatusBadge({
  status,
  className,
}: {
  status: EventStatus;
  className?: string;
}) {
  return <StatusBadge status={status} type="event" className={className} />;
}

export function ClientStatusBadge({
  status,
  className,
}: {
  status: ClientStatus;
  className?: string;
}) {
  return <StatusBadge status={status} type="client" className={className} />;
}
