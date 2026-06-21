import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/data/auth";
import {
  fetchNhostStorageFile,
  isNhostStorageConfigured,
} from "@/lib/nhost-storage-server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!isNhostStorageConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Nhost storage is not configured" },
      { status: 503 }
    );
  }

  const { fileId } = await params;

  try {
    const upstream = await fetchNhostStorageFile(fileId);
    if (!upstream.ok) {
      return NextResponse.json(
        { ok: false, error: "File not found" },
        { status: upstream.status === 404 ? 404 : 502 }
      );
    }

    const contentType =
      upstream.headers.get("content-type") ?? "application/octet-stream";
    const body = upstream.body;
    if (!body) {
      return NextResponse.json(
        { ok: false, error: "Empty file response" },
        { status: 502 }
      );
    }

    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to load file",
      },
      { status: 500 }
    );
  }
}
