"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { transitionEventStatusAction } from "../_actions/event.actions";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import type { EventStatus } from "@/lib/types";

const TRANSITIONS: Partial<
  Record<EventStatus, { next: EventStatus; label: string; confirm?: string }[]>
> = {
  draft: [{ next: "ready", label: "Mark Ready" }],
  ready: [
    { next: "live", label: "Go Live", confirm: "Start the live event? Guests can begin uploading." },
    { next: "draft", label: "Back to Draft" },
  ],
  live: [
    {
      next: "ended",
      label: "End Event",
      confirm: "End this event early? Uploads will stop and curation can begin.",
    },
  ],
  ended: [
    { next: "archived", label: "Archive", confirm: "Archive this event? It will be hidden from active lists." },
  ],
};

interface EventStatusActionsProps {
  eventId: string;
  status: EventStatus;
}

export function EventStatusActions({ eventId, status }: EventStatusActionsProps) {
  const [isPending, startTransition] = useTransition();
  const actions = TRANSITIONS[status] ?? [];

  function handleTransition(next: EventStatus) {
    startTransition(async () => {
      try {
        await transitionEventStatusAction(eventId, next);
        toast.success(`Event ${next === "live" ? "is now live" : `moved to ${next}`}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update status");
      }
    });
  }

  if (actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => {
        const isPrimary = action.next === "ready" || action.next === "live";
        const button = (
          <Button
            key={action.next}
            size="sm"
            variant={isPrimary ? "default" : "outline"}
            disabled={isPending}
          >
            {action.label}
          </Button>
        );

        if (action.confirm) {
          return (
            <ConfirmationDialog
              key={action.next}
              trigger={button}
              title={action.label}
              description={action.confirm}
              confirmLabel={action.label}
              variant={action.next === "ended" || action.next === "archived" ? "destructive" : "default"}
              onConfirm={() => handleTransition(action.next)}
            />
          );
        }

        return (
          <Button
            key={action.next}
            size="sm"
            variant={isPrimary ? "default" : "outline"}
            disabled={isPending}
            onClick={() => handleTransition(action.next)}
          >
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}
