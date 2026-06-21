"use client";

import { useSubscription } from "@apollo/client/react";
import { SUBSCRIBE_ACTIVE_SESSIONS } from "@/lib/graphql/events/subscriptions";
import type { ActiveSessionsData } from "@/lib/types/subscriptions";
import { useAuth } from "@/lib/auth/auth-context";

export function useSessionCount(eventId: string) {
  const { accessToken } = useAuth();
  const { data, loading, error } = useSubscription<ActiveSessionsData>(
    SUBSCRIBE_ACTIVE_SESSIONS,
    {
      variables: { eventId },
      skip: !accessToken,
    }
  );

  const count = data?.guest_sessions_aggregate?.aggregate?.count ?? 0;

  return { count, loading, error };
}
