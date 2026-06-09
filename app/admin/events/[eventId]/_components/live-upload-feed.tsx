"use client";

import { useTransition } from "react";
import { EyeOff } from "lucide-react";
import { toast } from "sonner";
import { toggleMediaHiddenAction } from "../../_actions/media.actions";
import type { Media } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils/format";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LiveUploadFeedProps {
  eventId: string;
  media: Media[];
}

export function LiveUploadFeed({ eventId, media }: LiveUploadFeedProps) {
  const [isPending, startTransition] = useTransition();
  const recent = media.filter((m) => !m.is_hidden).slice(0, 12);

  function toggleHidden(item: Media) {
    startTransition(async () => {
      try {
        await toggleMediaHiddenAction(eventId, item.id, !item.is_hidden);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Live upload feed</CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">Waiting for uploads…</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {recent.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square rounded-lg border bg-muted p-2"
              >
                <div className="flex h-full flex-col justify-between text-xs">
                  <span className="capitalize text-muted-foreground">
                    {item.file_type}
                  </span>
                  <span>{formatDateTime(item.uploaded_at)}</span>
                </div>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute right-1 top-1 h-7 w-7 opacity-0 group-hover:opacity-100"
                  disabled={isPending}
                  onClick={() => toggleHidden(item)}
                >
                  <EyeOff className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
