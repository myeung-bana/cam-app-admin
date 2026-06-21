"use client";

import { useSubscription } from "@apollo/client/react";
import { Users } from "lucide-react";
import { SUBSCRIBE_ACTIVE_SESSIONS } from "@/lib/graphql/events/subscriptions";
import type { ActiveSessionsData } from "@/lib/types/subscriptions";
import { useAuth } from "@/lib/auth/auth-context";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LiveSessionCountProps {
  eventId: string;
  max: number;
}

export function LiveSessionCount({ eventId, max }: LiveSessionCountProps) {
  const { accessToken } = useAuth();
  const { data } = useSubscription<ActiveSessionsData>(SUBSCRIBE_ACTIVE_SESSIONS, {
    variables: { eventId },
    skip: !accessToken,
  });

  const count = data?.guest_sessions_aggregate?.aggregate?.count ?? 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Live attendees</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {count}{" "}
          <span className="text-base font-normal text-muted-foreground">
            / {max}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Active in the last 5 minutes
        </p>
      </CardContent>
    </Card>
  );
}
