"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  updatePortalSettingsAction,
  resendMemoriesEmailAction,
} from "@/app/admin/events/_actions/event.actions";
import type { Client, Event } from "@/lib/types";
import { formatDate, formatDateTime } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PortalControlsProps {
  event: Event;
  client: Client | null;
}

export function PortalControls({ event, client }: PortalControlsProps) {
  const [isPending, startTransition] = useTransition();

  function updateSetting(
    key: "portal_gallery_visible" | "reel_shareable",
    value: boolean
  ) {
    startTransition(async () => {
      try {
        await updatePortalSettingsAction(event.id, { [key]: value });
        toast.success("Portal settings updated");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update");
      }
    });
  }

  function extendRetention(days: number) {
    const base = event.retention_expires_at
      ? new Date(event.retention_expires_at)
      : new Date();
    base.setDate(base.getDate() + days);
    startTransition(async () => {
      try {
        await updatePortalSettingsAction(event.id, {
          retention_expires_at: base.toISOString(),
        });
        toast.success(`Retention extended by ${days} days`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to extend");
      }
    });
  }

  function resendEmail() {
    startTransition(async () => {
      try {
        await resendMemoriesEmailAction(event.id);
        toast.success("Memories ready email sent");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to send");
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Client portal visibility</CardTitle>
          <CardDescription>
            Control what the client sees in their portal after the event.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Gallery visible to client</Label>
              <p className="text-xs text-muted-foreground">
                Show curated photos and videos in the portal gallery.
              </p>
            </div>
            <Switch
              checked={event.portal_gallery_visible}
              disabled={isPending}
              onCheckedChange={(v) => updateSetting("portal_gallery_visible", v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Reel shareable (public link)</Label>
              <p className="text-xs text-muted-foreground">
                Allow the client to share the highlight reel publicly.
              </p>
            </div>
            <Switch
              checked={event.reel_shareable}
              disabled={isPending}
              onCheckedChange={(v) => updateSetting("reel_shareable", v)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Client access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="text-muted-foreground">Last portal login</p>
            <p className="font-medium">
              {client?.portal_last_login_at
                ? formatDateTime(client.portal_last_login_at)
                : "Never"}
            </p>
          </div>
          <Button variant="outline" size="sm" disabled={isPending} onClick={resendEmail}>
            Resend memories ready email
          </Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Retention</CardTitle>
          <CardDescription>
            Media is retained until this date. Extend for admin overrides.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-4">
          <div className="grid gap-2">
            <Label>Expiry date</Label>
            <Input
              readOnly
              value={
                event.retention_expires_at
                  ? formatDate(event.retention_expires_at)
                  : "Not set"
              }
              className="w-48"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => extendRetention(30)}
          >
            Extend 30 days
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => extendRetention(90)}
          >
            Extend 90 days
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
