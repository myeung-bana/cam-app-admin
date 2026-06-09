"use client";

import { useSubscription } from "@apollo/client/react";
import { SUBSCRIBE_ACTIVE_SESSIONS } from "@/lib/graphql/events/subscriptions";
import type { ActiveSessionsData } from "@/lib/types/subscriptions";

export function useSessionCount(eventId: string) {
  const { data, loading, error } = useSubscription<ActiveSessionsData>(
    SUBSCRIBE_ACTIVE_SESSIONS,
    {
      variables: { eventId },
      skip: !process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN,
    }
  );

  const count = data?.sessions_aggregate?.aggregate?.count ?? 0;

  return { count, loading, error };
}
