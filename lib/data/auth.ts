import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthSession } from "@/lib/types";
import { isDevMode } from "@/lib/dev/config";
import { isAdminUser } from "@/lib/auth/roles";
import {
  ADMIN_ROLE,
  DEV_SESSION_COOKIE,
  LOGIN_PATH,
  UNAUTHORIZED_ERROR,
} from "@/lib/auth/constants";
import { buildLoginRedirect } from "@/lib/auth/redirects";
import {
  refreshViaFunction,
  signInViaFunction,
  signOutViaFunction,
} from "@/lib/auth/functions-client";
import { isAccessTokenExpired } from "@/lib/auth/access-token";
import {
  clearMemoSessionCookies,
  readMemoAccessToken,
  readMemoRefreshToken,
  readMemoUser,
  setMemoSessionCookies,
} from "@/lib/auth/session-cookies";

interface DevSessionCookie {
  user: {
    id: string;
    email: string;
    displayName?: string;
    defaultRole?: string;
    roles?: string[];
  };
}

async function getDevSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const devCookie = cookieStore.get(DEV_SESSION_COOKIE);
  if (!devCookie?.value) return null;

  try {
    const session = JSON.parse(devCookie.value) as DevSessionCookie;
    return {
      accessToken: "dev-access-token",
      role: session.user.defaultRole ?? ADMIN_ROLE,
      user: {
        id: session.user.id,
        email: session.user.email,
        displayName: session.user.displayName,
      },
    };
  } catch {
    return null;
  }
}

async function refreshMemoTokens() {
  const refreshToken = await readMemoRefreshToken();
  if (!refreshToken) return null;

  try {
    return await refreshViaFunction(refreshToken);
  } catch {
    return null;
  }
}

/** Read session without mutating cookies — safe for Server Components. */
async function getMemoSession(): Promise<AuthSession | null> {
  const refreshToken = await readMemoRefreshToken();
  const user = await readMemoUser();
  let accessToken = await readMemoAccessToken();

  if (!refreshToken || !user) {
    return null;
  }

  if (!accessToken || isAccessTokenExpired(accessToken)) {
    const refreshed = await refreshMemoTokens();
    if (!refreshed) return null;
    accessToken = refreshed.accessToken;
  }

  const role = user.defaultRole;

  return {
    accessToken,
    role,
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
    },
  };
}

/** Refresh and persist cookies — only call from Route Handlers or Server Actions. */
export async function persistMemoSessionIfNeeded(): Promise<void> {
  const refreshToken = await readMemoRefreshToken();
  const user = await readMemoUser();
  const accessToken = await readMemoAccessToken();

  if (!refreshToken || !user) return;
  if (accessToken && !isAccessTokenExpired(accessToken)) return;

  const refreshed = await refreshMemoTokens();
  if (!refreshed) {
    await clearMemoSessionCookies();
    return;
  }

  await setMemoSessionCookies(refreshed);
}

export async function getAuthSession(): Promise<AuthSession | null> {
  if (isDevMode()) {
    const devSession = await getDevSession();
    if (devSession) return devSession;
  }

  return getMemoSession();
}

export async function getAdminSession(): Promise<AuthSession | null> {
  const session = await getAuthSession();
  if (!session) return null;

  if (isDevMode() && session.accessToken === "dev-access-token") {
    return session;
  }

  if (
    isAdminUser({
      defaultRole: session.role,
      accessToken: session.accessToken,
    })
  ) {
    return session;
  }

  return null;
}

export async function requireAdminSession(): Promise<AuthSession> {
  const session = await getAdminSession();
  if (session) return session;

  const cookieStore = await cookies();
  const hasAnySession =
    cookieStore.has(DEV_SESSION_COOKIE) ||
    Boolean(await readMemoRefreshToken());

  if (hasAnySession) {
    redirect(buildLoginRedirect("/admin/dashboard", UNAUTHORIZED_ERROR));
  }

  redirect(LOGIN_PATH);
}

export async function signInAdmin(
  email: string,
  password: string
): Promise<AuthSession> {
  const session = await signInViaFunction(email, password);
  await setMemoSessionCookies(session);

  return {
    accessToken: session.accessToken,
    role: session.user.defaultRole,
    user: {
      id: session.user.id,
      email: session.user.email,
      displayName: session.user.displayName,
    },
  };
}

export async function signOutAdmin(): Promise<void> {
  if (isDevMode()) {
    const cookieStore = await cookies();
    cookieStore.delete(DEV_SESSION_COOKIE);
    return;
  }

  const refreshToken = await readMemoRefreshToken();

  if (refreshToken) {
    try {
      await signOutViaFunction(refreshToken);
    } catch {
      // Clear local session even if remote sign-out fails.
    }
  }

  await clearMemoSessionCookies();
}
