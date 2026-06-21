import "server-only";
import { cookies } from "next/headers";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import type { FunctionAuthSession } from "@/lib/auth/functions-client";
import {
  MEMO_ACCESS_TOKEN_COOKIE,
  MEMO_REFRESH_TOKEN_COOKIE,
  MEMO_USER_COOKIE,
} from "@/lib/auth/constants";

interface StoredMemoUser {
  id: string;
  email: string;
  displayName?: string;
  defaultRole?: string;
}

function baseCookieOptions(maxAge: number): Partial<ResponseCookie> {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export async function setMemoSessionCookies(
  session: FunctionAuthSession
): Promise<void> {
  const cookieStore = await cookies();
  const user: StoredMemoUser = {
    id: session.user.id,
    email: session.user.email,
    displayName: session.user.displayName,
    defaultRole: session.user.defaultRole,
  };

  cookieStore.set(
    MEMO_ACCESS_TOKEN_COOKIE,
    session.accessToken,
    baseCookieOptions(session.accessTokenExpiresIn)
  );
  cookieStore.set(
    MEMO_REFRESH_TOKEN_COOKIE,
    session.refreshToken,
    baseCookieOptions(60 * 60 * 24 * 30)
  );
  cookieStore.set(
    MEMO_USER_COOKIE,
    JSON.stringify(user),
    baseCookieOptions(60 * 60 * 24 * 30)
  );
}

export async function clearMemoSessionCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(MEMO_ACCESS_TOKEN_COOKIE);
  cookieStore.delete(MEMO_REFRESH_TOKEN_COOKIE);
  cookieStore.delete(MEMO_USER_COOKIE);
}

export async function readMemoRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(MEMO_REFRESH_TOKEN_COOKIE)?.value ?? null;
}

export async function readMemoAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(MEMO_ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function readMemoUser(): Promise<StoredMemoUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(MEMO_USER_COOKIE)?.value;
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredMemoUser;
  } catch {
    return null;
  }
}
