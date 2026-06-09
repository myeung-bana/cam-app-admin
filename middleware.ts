import { NextRequest, NextResponse } from "next/server";

const ADMIN_PREFIX = "/admin";
const PUBLIC_PATHS = ["/login", "/api"];

function isDevModeEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_DEV_MODE === "true"
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  if (isPublic) return NextResponse.next();

  if (pathname.startsWith(ADMIN_PREFIX)) {
    const hasNhostSession = request.cookies.has("nhostSession");
    const hasDevSession =
      isDevModeEnabled() && request.cookies.has("devSession");

    if (!hasNhostSession && !hasDevSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
