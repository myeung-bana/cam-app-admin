import { NextResponse } from "next/server";
import {
  getAdminSession,
  persistMemoSessionIfNeeded,
} from "@/lib/data/auth";

export async function GET() {
  await persistMemoSessionIfNeeded();
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    data: {
      user: session.user,
      accessToken: session.accessToken,
    },
  });
}
