import { NextRequest, NextResponse } from "next/server";
import { getEventById } from "@/lib/data/events";
import { generateQrToken } from "@/lib/utils/qr";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const { token } = await req.json();
  const secret = process.env.QR_HMAC_SECRET;

  if (!secret) {
    return NextResponse.json(
      { valid: false, reason: "server_misconfigured" },
      { status: 500 }
    );
  }

  const expected = generateQrToken(eventId, secret);

  if (token !== expected) {
    return NextResponse.json(
      { valid: false, reason: "invalid_token" },
      { status: 401 }
    );
  }

  const event = await getEventById(eventId);
  if (!event) {
    return NextResponse.json(
      { valid: false, reason: "event_not_found" },
      { status: 404 }
    );
  }

  const now = new Date();
  const start = new Date(event.start_time);
  const end = new Date(event.end_time);
  const gracePeriodMs = 30 * 60 * 1000;

  if (now < start) {
    return NextResponse.json({ valid: false, reason: "not_started" });
  }
  if (now > new Date(end.getTime() + gracePeriodMs)) {
    return NextResponse.json({ valid: false, reason: "event_ended" });
  }

  return NextResponse.json({ valid: true, event });
}
