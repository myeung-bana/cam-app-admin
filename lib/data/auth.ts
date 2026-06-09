import "server-only";
import { cookies } from "next/headers";
import type { AuthSession } from "@/lib/types";
import { isDevMode } from "@/lib/dev/config";

interface NhostSessionCookie {
  accessToken: string;
  user?: {
    id: string;
    email?: string;
    displayName?: string;
  };
}

interface DevSessionCookie {
  user: {
    id: string;
    email: string;
    displayName?: string;
  };
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();

  if (isDevMode()) {
    const devCookie = cookieStore.get("devSession");
    if (devCookie?.value) {
      try {
        const session = JSON.parse(devCookie.value) as DevSessionCookie;
        return {
          accessToken: "dev-access-token",
          user: session.user,
        };
      } catch {
        return null;
      }
    }
  }

  const sessionCookie = cookieStore.get("nhostSession");

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const session = JSON.parse(sessionCookie.value) as NhostSessionCookie;

    if (!session.accessToken || !session.user?.id) {
      return null;
    }

    return {
      accessToken: session.accessToken,
      user: {
        id: session.user.id,
        email: session.user.email ?? "",
        displayName: session.user.displayName,
      },
    };
  } catch {
    return null;
  }
}
