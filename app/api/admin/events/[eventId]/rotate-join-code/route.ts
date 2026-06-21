import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/data/auth";
import { rotateEventJoinCode } from "@/lib/data/events";
import { rotateJoinCodeFromFunction } from "@/lib/functions/admin-events";
import { isDevMode } from "@/lib/dev/config";
import { isFunctionsConfigured } from "@/lib/functions/client";
import { revalidatePath } from "next/cache";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { eventId } = await params;

  try {
    if (!isDevMode() && isFunctionsConfigured()) {
      const result = await rotateJoinCodeFromFunction(eventId);
      revalidatePath(`/admin/events/${eventId}`);
      return NextResponse.json({ ok: true, data: result });
    }

    const event = await rotateEventJoinCode(eventId);
    revalidatePath(`/admin/events/${eventId}`);
    return NextResponse.json({
      ok: true,
      data: {
        eventId: event.id,
        joinCode: event.join_code,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Rotate failed",
      },
      { status: 500 }
    );
  }
}
