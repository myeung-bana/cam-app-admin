import { NextResponse } from "next/server";
import { isDevMode } from "@/lib/dev/config";

export async function POST() {
  if (!isDevMode()) {
    return NextResponse.json({ error: "Dev mode is disabled" }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete("devSession");
  return response;
}
