"use client";

import { useState, useTransition } from "react";
import { Check, Circle, Film } from "lucide-react";
import { toast } from "sonner";
import {
  generateReelAction,
  publishReelAction,
} from "../_actions/reel.actions";
import type { Event, Reel, ReelStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const MUSIC_TRACKS = [
  { value: "upbeat", label: "Upbeat celebration" },
  { value: "romantic", label: "Romantic piano" },
  { value: "cinematic", label: "Cinematic strings" },
  { value: "acoustic", label: "Acoustic folk" },
  { value: "electronic", label: "Electronic pulse" },
];

const STEPS: ReelStatus[] = ["queued", "processing", "ready", "failed"];

function stepIndex(status: ReelStatus | null): number {
  if (!status) return -1;
  if (status === "failed") return 3;
  return STEPS.indexOf(status);
}

interface ReelPanelProps {
  event: Event;
  reel: Reel | null;
}

export function ReelPanel({ event, reel }: ReelPanelProps) {
  const [musicTrack, setMusicTrack] = useState("upbeat");
  const [isPending, startTransition] = useTransition();
  const canGenerate = event.status === "ended" || event.status === "archived";
  const currentStep = stepIndex(reel?.status ?? null);

  function handleGenerate() {
    startTransition(async () => {
      try {
        await generateReelAction(event.id, musicTrack);
        toast.success("Reel generation queued");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to generate");
      }
    });
  }

  function handlePublish() {
    startTransition(async () => {
      try {
        await publishReelAction(event.id);
        toast.success("Reel published to portal");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to publish");
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Film className="h-4 w-4" />
            Reel status
          </CardTitle>
          <CardDescription>
            Generate an AI highlight reel after the event ends.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            {STEPS.filter((s) => s !== "failed").map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border",
                    currentStep >= i
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30"
                  )}
                >
                  {currentStep > i ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Circle className="h-3 w-3" />
                  )}
                </div>
                <span className="text-sm capitalize">{step}</span>
                {i < 2 && <div className="hidden h-px w-8 bg-border sm:block" />}
              </div>
            ))}
          </div>
          {reel?.status === "failed" && (
            <p className="mt-3 text-sm text-destructive">Generation failed. Try again.</p>
          )}
        </CardContent>
      </Card>

      {!reel && (
        <Card>
          <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Music track</Label>
              <Select value={musicTrack} onValueChange={(v) => v && setMusicTrack(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MUSIC_TRACKS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button disabled={!canGenerate || isPending} onClick={handleGenerate}>
                Generate reel
              </Button>
            </div>
            {!canGenerate && (
              <p className="text-sm text-muted-foreground sm:col-span-2">
                Reel generation is available after the event has ended.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {reel && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex aspect-video items-center justify-center rounded-lg border bg-muted">
              {reel.output_url ? (
                <p className="text-sm text-muted-foreground">
                  Reel ready — {reel.music_track} track
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Processing… preview will appear when ready.
                </p>
              )}
            </div>
            {reel.status === "ready" && !reel.published_at && (
              <ConfirmationDialog
                trigger={
                  <Button disabled={isPending}>Publish to Portal</Button>
                }
                title="Publish reel to portal?"
                description="The client will be notified that their memories are ready."
                confirmLabel="Publish"
                onConfirm={handlePublish}
              />
            )}
            {reel.published_at && (
              <p className="text-sm text-muted-foreground">
                Published on {new Date(reel.published_at).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
