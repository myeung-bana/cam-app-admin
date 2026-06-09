"use client";

import { useSubscription } from "@apollo/client/react";
import { SUBSCRIBE_MEDIA_FEED } from "@/lib/graphql/events/subscriptions";
import type { MediaFeedData } from "@/lib/types/subscriptions";

export function useMediaSubscription(eventId: string) {
  return useSubscription<MediaFeedData>(SUBSCRIBE_MEDIA_FEED, {
    variables: { eventId },
    skip: !process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN,
  });
}
