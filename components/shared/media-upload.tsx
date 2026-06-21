"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { isDevModeClient } from "@/lib/dev/config-client";

interface MediaUploadProps {
  eventId: string;
}

export function MediaUpload({ eventId }: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  if (isDevModeClient()) {
    return null;
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;

    setUploading(true);
    let successCount = 0;

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("eventId", eventId);
        formData.append("file", file);

        const response = await fetch("/api/admin/upload/media", {
          method: "POST",
          body: formData,
        });
        const json = (await response.json()) as {
          ok: boolean;
          error?: string;
        };

        if (!response.ok || !json.ok) {
          throw new Error(json.error ?? "Upload failed");
        }
        successCount += 1;
      }

      toast.success(
        successCount === 1
          ? "File uploaded"
          : `${successCount} files uploaded`
      );
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Button
        size="sm"
        variant="outline"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        {uploading ? "Uploading…" : "Upload test media"}
      </Button>
    </>
  );
}
