"use client";

import { useMemo, useTransition } from "react";
import { useSubscription } from "@apollo/client/react";
import { EyeOff } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { toggleMediaHiddenAction } from "../../_actions/media.actions";
import { SUBSCRIBE_MEDIA_FEED } from "@/lib/graphql/events/subscriptions";
import type { MediaFeedData } from "@/lib/types/subscriptions";
import { useAuth } from "@/lib/auth/auth-context";
import { getMediaDisplayUrl } from "@/lib/media-url";
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
  initialMedia: Media[];
}

export function LiveUploadFeed({ eventId, initialMedia }: LiveUploadFeedProps) {
  const { accessToken } = useAuth();
  const [isPending, startTransition] = useTransition();

  const { data } = useSubscription<MediaFeedData>(SUBSCRIBE_MEDIA_FEED, {
    variables: { eventId },
    skip: !accessToken,
  });

  const media = useMemo(() => {
    if (data?.media) {
      return data.media.map((item) => ({
        id: item.id,
        event_id: eventId,
        file_url: item.file_url,
        storage_file_id: item.storage_file_id ?? null,
        file_type: item.file_type as Media["file_type"],
        filter_applied: item.filter_applied,
        challenge_tag: null,
        uploaded_at: item.uploaded_at,
        is_hidden: item.is_hidden,
        is_starred: item.is_starred,
        session: item.session,
      }));
    }
    return initialMedia;
  }, [data?.media, eventId, initialMedia]);

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
            {recent.map((item) => {
              const displayUrl = getMediaDisplayUrl(item);
              return (
                <div
                  key={item.id}
                  className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                >
                  {displayUrl ? (
                    <Image
                      src={displayUrl}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full flex-col justify-between p-2 text-xs">
                      <span className="capitalize text-muted-foreground">
                        {item.file_type}
                      </span>
                      <span>{formatDateTime(item.uploaded_at)}</span>
                    </div>
                  )}
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
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
