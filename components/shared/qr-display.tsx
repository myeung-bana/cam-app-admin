"use client";

import { useTransition } from "react";
import { Download, ExternalLink, FileText, QrCode, RefreshCw } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { regenerateQrAction } from "@/app/admin/events/_actions/event.actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QrDisplayProps {
  imageUrl: string | null;
  eventId: string;
}

export function QrDisplay({ imageUrl, eventId }: QrDisplayProps) {
  const [isPending, startTransition] = useTransition();
  const qrApiUrl = `/api/events/${eventId}/qr`;
  const sandboxUrl = `/e/${eventId}?preview=true`;

  function handleRegenerate() {
    startTransition(async () => {
      try {
        await regenerateQrAction(eventId);
        toast.success("QR code regenerated");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to regenerate QR");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <QrCode className="h-4 w-4" />
          Event QR Code
        </CardTitle>
        <CardDescription>
          Guests scan this code to join the event. Valid only during the scheduled
          time window.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex h-48 w-48 items-center justify-center rounded-lg border bg-white p-4">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Event QR code"
              width={160}
              height={160}
              className="h-full w-full object-contain"
              unoptimized
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrApiUrl}
              alt="Event QR code"
              className="h-full w-full object-contain"
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <a
            href={qrApiUrl}
            download={`event-${eventId}-qr.svg`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "inline-flex items-center"
            )}
          >
            <Download className="mr-2 h-4 w-4" />
            Download PNG / SVG
          </a>
          <Button variant="outline" size="sm" disabled>
            <FileText className="mr-2 h-4 w-4" />
            Print-ready PDF (coming soon)
          </Button>
          <ConfirmationDialog
            trigger={
              <Button variant="outline" size="sm" disabled={isPending}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate QR
              </Button>
            }
            title="Regenerate QR code?"
            description="The current QR code will stop working. Print materials must be updated."
            confirmLabel="Regenerate"
            variant="destructive"
            onConfirm={handleRegenerate}
          />
          <a
            href={sandboxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "inline-flex items-center"
            )}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Test entry flow
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
