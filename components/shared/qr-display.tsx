"use client";

import { useTransition, useState } from "react";
import { Download, ExternalLink, FileText, QrCode, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { rotateJoinCodeAction } from "@/app/admin/events/_actions/event.actions";
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
import { buildGuestJoinUrl } from "@/lib/utils/join-code";

interface QrDisplayProps {
  joinCode: string;
  eventId: string;
}

export function QrDisplay({ joinCode, eventId }: QrDisplayProps) {
  const [isPending, startTransition] = useTransition();
  const [currentJoinCode, setCurrentJoinCode] = useState(joinCode);
  const qrApiUrl = `/api/admin/events/${eventId}/qr`;
  const joinUrl = buildGuestJoinUrl(currentJoinCode);
  const sandboxUrl = `${joinUrl}?preview=true`;

  function handleCopyLink() {
    void navigator.clipboard.writeText(joinUrl);
    toast.success("Join link copied");
  }

  function handleRotate() {
    startTransition(async () => {
      try {
        const result = await rotateJoinCodeAction(eventId);
        setCurrentJoinCode(result.joinCode);
        toast.success("Join code rotated — reprint QR materials");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to rotate join code");
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
          This QR never expires. Event rules (times, cap, status) are checked
          when guests scan. Code: <span className="font-mono">{currentJoinCode}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex h-48 w-48 items-center justify-center rounded-lg border bg-white p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${qrApiUrl}?v=${currentJoinCode}`}
            alt="Event QR code"
            className="h-full w-full object-contain"
          />
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
            Download SVG
          </a>
          <Button variant="outline" size="sm" onClick={handleCopyLink}>
            <Copy className="mr-2 h-4 w-4" />
            Copy join link
          </Button>
          <Button variant="outline" size="sm" disabled>
            <FileText className="mr-2 h-4 w-4" />
            Print-ready PDF (coming soon)
          </Button>
          <ConfirmationDialog
            trigger={
              <Button variant="outline" size="sm" disabled={isPending}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Rotate join code (emergency)
              </Button>
            }
            title="Rotate join code?"
            description="This invalidates the current printed QR. Only use if the join link was compromised."
            confirmLabel="Rotate code"
            variant="destructive"
            onConfirm={handleRotate}
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
