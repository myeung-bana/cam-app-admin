"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  archiveClientAction,
  resendPortalInviteAction,
} from "../_actions/client.actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";

interface ClientDetailActionsProps {
  clientId: string;
}

export function ClientDetailActions({ clientId }: ClientDetailActionsProps) {
  const [isPending, startTransition] = useTransition();

  function handleResendInvite() {
    startTransition(async () => {
      try {
        await resendPortalInviteAction(clientId);
        toast.success("Portal invitation resent");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to resend invite");
      }
    });
  }

  function handleArchive() {
    startTransition(async () => {
      try {
        await archiveClientAction(clientId);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to archive");
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/admin/clients/${clientId}/edit`}
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        Edit
      </Link>
      <Button
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={handleResendInvite}
      >
        Resend portal invite
      </Button>
      <ConfirmationDialog
        trigger={
          <Button variant="destructive" size="sm" disabled={isPending}>
            Archive
          </Button>
        }
        title="Archive client?"
        description="This client will be archived and hidden from active lists. Associated events are preserved."
        confirmLabel="Archive"
        variant="destructive"
        onConfirm={handleArchive}
      />
    </div>
  );
}
