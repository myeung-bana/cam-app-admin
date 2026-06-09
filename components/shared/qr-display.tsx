"use client";

import { Download, QrCode, RefreshCw } from "lucide-react";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
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
  const qrApiUrl = `/api/events/${eventId}/qr`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <QrCode className="h-4 w-4" />
          Event QR Code
        </CardTitle>
        <CardDescription>
          Guests scan this code to join the event. Valid only during the
          scheduled time window.
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
            Download SVG
          </a>
          <Button variant="outline" size="sm" disabled>
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate QR
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
