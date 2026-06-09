import { NextRequest, NextResponse } from "next/server";
import { getEventById } from "@/lib/data/events";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const event = await getEventById(eventId);

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  if (event.status !== "ended") {
    return NextResponse.json(
      { error: "Reel generation is only available after the event has ended" },
      { status: 400 }
    );
  }

  // Placeholder — reel trigger will call Nhost Function once backend is wired
  return NextResponse.json({
    status: "pending",
    message: "Reel generation queued (not yet connected to backend)",
  });
}
