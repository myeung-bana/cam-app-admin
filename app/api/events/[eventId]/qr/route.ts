import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { generateQrToken } from "@/lib/utils/qr";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const secret = process.env.QR_HMAC_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!secret) {
    return NextResponse.json(
      { error: "QR_HMAC_SECRET is not configured" },
      { status: 500 }
    );
  }

  const token = generateQrToken(eventId, secret);
  const url = `${appUrl}/event/${eventId}?token=${token}`;
  const svg = await QRCode.toString(url, { type: "svg" });

  return new NextResponse(svg, {
    headers: { "Content-Type": "image/svg+xml" },
  });
}
