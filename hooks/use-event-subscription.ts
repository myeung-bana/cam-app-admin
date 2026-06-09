"use client";

import { useSubscription } from "@apollo/client/react";
import { SUBSCRIBE_EVENT_MEDIA } from "@/lib/graphql/media/subscriptions";
import type { MediaFeedData } from "@/lib/types/subscriptions";

export function useEventSubscription(eventId: string) {
  return useSubscription<MediaFeedData>(SUBSCRIBE_EVENT_MEDIA, {
    variables: { eventId },
    skip: !process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN,
  });
}
