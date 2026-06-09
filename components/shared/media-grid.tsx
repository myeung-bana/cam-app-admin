"use client";

import { useMemo, useState, useTransition } from "react";
import { Eye, EyeOff, Star } from "lucide-react";
import { toast } from "sonner";
import {
  toggleMediaHiddenAction,
  toggleMediaStarAction,
} from "@/app/admin/events/_actions/media.actions";
import type { Media } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface MediaGridProps {
  eventId: string;
  media: Media[];
}

export function MediaGrid({ eventId, media }: MediaGridProps) {
  const [fileType, setFileType] = useState<string>("all");
  const [starredOnly, setStarredOnly] = useState(false);
  const [hiddenFilter, setHiddenFilter] = useState<string>("all");
  const [challengeTag, setChallengeTag] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const challengeTags = useMemo(
    () =>
      [...new Set(media.map((m) => m.challenge_tag).filter(Boolean))] as string[],
    [media]
  );

  const filtered = useMemo(() => {
    return media.filter((item) => {
      if (fileType !== "all" && item.file_type !== fileType) return false;
      if (starredOnly && !item.is_starred) return false;
      if (hiddenFilter === "visible" && item.is_hidden) return false;
      if (hiddenFilter === "hidden" && !item.is_hidden) return false;
      if (challengeTag && item.challenge_tag !== challengeTag) return false;
      return true;
    });
  }, [media, fileType, starredOnly, hiddenFilter, challengeTag]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function bulkStar(starred: boolean) {
    startTransition(async () => {
      try {
        await Promise.all(
          [...selected].map((id) => toggleMediaStarAction(eventId, id, starred))
        );
        toast.success(starred ? "Items starred" : "Stars removed");
        setSelected(new Set());
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Bulk action failed");
      }
    });
  }

  function bulkHide(hidden: boolean) {
    startTransition(async () => {
      try {
        await Promise.all(
          [...selected].map((id) => toggleMediaHiddenAction(eventId, id, hidden))
        );
        toast.success(hidden ? "Items hidden" : "Items unhidden");
        setSelected(new Set());
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Bulk action failed");
      }
    });
  }

  function toggleStar(item: Media) {
    startTransition(async () => {
      try {
        await toggleMediaStarAction(eventId, item.id, !item.is_starred);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update");
      }
    });
  }

  function toggleHidden(item: Media) {
    startTransition(async () => {
      try {
        await toggleMediaHiddenAction(eventId, item.id, !item.is_hidden);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 rounded-lg border p-4">
        <div className="grid gap-1">
          <Label className="text-xs">File type</Label>
          <Select value={fileType} onValueChange={(v) => v && setFileType(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="photo">Photos</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1">
          <Label className="text-xs">Visibility</Label>
          <Select value={hiddenFilter} onValueChange={(v) => v && setHiddenFilter(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="visible">Visible</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {challengeTags.length > 0 && (
          <div className="grid gap-1">
            <Label className="text-xs">Challenge</Label>
            <Select value={challengeTag || "all"} onValueChange={(v) => setChallengeTag(v === "all" ? "" : v ?? "")}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {challengeTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex items-center gap-2 pb-0.5">
          <input
            type="checkbox"
            id="starred-only"
            checked={starredOnly}
            onChange={(e) => setStarredOnly(e.target.checked)}
            className="h-4 w-4"
          />
          <Label htmlFor="starred-only" className="text-sm">
            Starred only
          </Label>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/50 px-4 py-2">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <Button size="sm" variant="outline" disabled={isPending} onClick={() => bulkStar(true)}>
            Star selected
          </Button>
          <Button size="sm" variant="outline" disabled={isPending} onClick={() => bulkHide(true)}>
            Hide selected
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
            Clear
          </Button>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No media matches the current filters.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={cn(
                "group relative aspect-square rounded-lg border bg-muted",
                item.is_hidden && "opacity-50",
                selected.has(item.id) && "ring-2 ring-primary"
              )}
            >
              <input
                type="checkbox"
                checked={selected.has(item.id)}
                onChange={() => toggleSelect(item.id)}
                className="absolute left-2 top-2 z-10 h-4 w-4"
              />
              {item.is_starred && (
                <Star className="absolute right-2 top-2 z-10 h-4 w-4 fill-amber-400 text-amber-400" />
              )}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex w-full gap-1">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-7 w-7"
                    disabled={isPending}
                    onClick={() => toggleStar(item)}
                  >
                    <Star className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-7 w-7"
                    disabled={isPending}
                    onClick={() => toggleHidden(item)}
                  >
                    {item.is_hidden ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex h-full flex-col items-center justify-center p-2 text-center text-xs text-muted-foreground">
                <span className="capitalize">{item.file_type}</span>
                {item.challenge_tag && (
                  <span className="mt-1 truncate">{item.challenge_tag}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
