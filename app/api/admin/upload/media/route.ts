import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/data/auth";
import { executeGraphQL } from "@/lib/graphql/execute";
import { INSERT_MEDIA } from "@/lib/graphql/media/mutations";
import {
  buildNhostFileUrl,
  isNhostStorageConfigured,
  postMultipartToNhostStorage,
} from "@/lib/nhost-storage-server";
import type { Media } from "@/lib/types";

function inferFileType(mimeType: string): "photo" | "video" | null {
  if (mimeType.startsWith("image/")) return "photo";
  if (mimeType.startsWith("video/")) return "video";
  return null;
}

export async function POST(req: NextRequest) {
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

  try {
    const formData = await req.formData();
    const eventId = formData.get("eventId");
    const fileEntry = formData.get("file");

    if (typeof eventId !== "string" || !eventId) {
      return NextResponse.json(
        { ok: false, error: "eventId is required" },
        { status: 400 }
      );
    }

    if (!(fileEntry instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "file is required" },
        { status: 400 }
      );
    }

    const mimeType = fileEntry.type || "application/octet-stream";
    const fileType = inferFileType(mimeType);
    if (!fileType) {
      return NextResponse.json(
        { ok: false, error: "Only image and video files are supported" },
        { status: 400 }
      );
    }

    const fileBytes = Buffer.from(await fileEntry.arrayBuffer());
    const uploaded = await postMultipartToNhostStorage(
      fileEntry.name || "upload",
      fileBytes,
      mimeType
    );

    const publicUrl = buildNhostFileUrl(uploaded.id);

    const data = await executeGraphQL<{
      insert_media_one: {
        id: string;
        event_id: string;
        file_url: string;
        storage_file_id: string | null;
        file_type: Media["file_type"];
        uploaded_at: string;
      };
    }>(INSERT_MEDIA, {
      object: {
        event_id: eventId,
        file_url: publicUrl,
        storage_file_id: uploaded.id,
        file_type: fileType,
        is_hidden: false,
        is_starred: false,
      },
    });

    const media = data.insert_media_one;

    return NextResponse.json({
      ok: true,
      data: {
        fileId: uploaded.id,
        publicUrl,
        mediaId: media.id,
        storageBackend: "nhost" as const,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed";
    const status = message.includes("catalog") || message.includes("GraphQL")
      ? 502
      : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
