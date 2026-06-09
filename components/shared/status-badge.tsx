import { Badge } from "@/components/ui/badge";
import type { EventStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  EventStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  draft: { label: "Draft", variant: "secondary" },
  active: { label: "Active", variant: "default" },
  ended: { label: "Ended", variant: "outline" },
  archived: { label: "Archived", variant: "destructive" },
};

interface StatusBadgeProps {
  status: EventStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;

  return (
    <Badge variant={config.variant} className={cn(className)}>
      {config.label}
    </Badge>
  );
}
