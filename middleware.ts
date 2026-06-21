import { NextRequest, NextResponse } from "next/server";
import {
  DEV_SESSION_COOKIE,
  LOGIN_PATH,
  MEMO_ACCESS_TOKEN_COOKIE,
  MEMO_REFRESH_TOKEN_COOKIE,
} from "@/lib/auth/constants";

function isDevModeEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_DEV_MODE === "true"
  );
}

function hasSessionCookies(request: NextRequest): boolean {
  const hasDevSession =
    isDevModeEnabled() && request.cookies.has(DEV_SESSION_COOKIE);

  const hasMemoSession =
    request.cookies.has(MEMO_REFRESH_TOKEN_COOKIE) &&
    request.cookies.has(MEMO_ACCESS_TOKEN_COOKIE);

  return hasDevSession || hasMemoSession;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !hasSessionCookies(request)) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
