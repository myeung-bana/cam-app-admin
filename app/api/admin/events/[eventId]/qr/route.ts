import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { getAdminSession } from "@/lib/data/auth";
import { getEventById } from "@/lib/data/events";
import { getEventQrFromFunction } from "@/lib/functions/admin-events";
import { isDevMode } from "@/lib/dev/config";
import { buildGuestJoinUrl } from "@/lib/utils/join-code";
import { isFunctionsConfigured } from "@/lib/functions/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { eventId } = await params;

  if (!isDevMode() && isFunctionsConfigured()) {
    try {
      const result = await getEventQrFromFunction(eventId);
      return new NextResponse(result.svg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "X-Join-Url": result.joinUrl,
          "X-Join-Code": result.joinCode,
        },
      });
    } catch {
      // Fall through to local generation
    }
  }

  const event = await getEventById(eventId);
  if (!event) {
    return NextResponse.json({ ok: false, error: "Event not found" }, { status: 404 });
  }

  const joinUrl = buildGuestJoinUrl(event.join_code);
  const svg = await QRCode.toString(joinUrl, { type: "svg" });

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "X-Join-Url": joinUrl,
      "X-Join-Code": event.join_code,
    },
  });
}
