import { NextRequest, NextResponse } from "next/server";
import { isDevMode } from "@/lib/dev/config";

export async function POST(req: NextRequest) {
  if (!isDevMode()) {
    return NextResponse.json({ error: "Dev mode is disabled" }, { status: 403 });
  }

  const { email, password } = await req.json();

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Email and password (min 8 chars) required" },
      { status: 400 }
    );
  }

  const session = {
    user: {
      id: "dev-admin-user",
      email,
      displayName: email.split("@")[0],
    },
  };

  const response = NextResponse.json({ ok: true });
  response.cookies.set("devSession", JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
