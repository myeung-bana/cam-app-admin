"use client";

import { useActionState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import type { DashboardConfig } from "@/lib/types";
import { updateDashboardAction } from "../_actions/update-dashboard.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DashboardEditorProps {
  config: DashboardConfig;
}

export function DashboardEditor({ config }: DashboardEditorProps) {
  const [state, formAction, isPending] = useActionState(
    updateDashboardAction,
    {}
  );

  useEffect(() => {
    if (state.success) toast.success("Dashboard updated");
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            Edit dashboard
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit dashboard</DialogTitle>
          <DialogDescription>
            Update platform metrics and page heading (dev mode).
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Page title</Label>
            <Input id="title" name="title" defaultValue={config.title} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              defaultValue={config.description}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="activeEventsToday">Active events today</Label>
              <Input
                id="activeEventsToday"
                name="activeEventsToday"
                type="number"
                min={0}
                defaultValue={config.activeEventsToday}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="uploadsThisWeek">Uploads this week</Label>
              <Input
                id="uploadsThisWeek"
                name="uploadsThisWeek"
                type="number"
                min={0}
                defaultValue={config.uploadsThisWeek}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clientsOnboarded">Clients onboarded</Label>
              <Input
                id="clientsOnboarded"
                name="clientsOnboarded"
                type="number"
                min={0}
                defaultValue={config.clientsOnboarded}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reelsDelivered">Reels delivered</Label>
              <Input
                id="reelsDelivered"
                name="reelsDelivered"
                type="number"
                min={0}
                defaultValue={config.reelsDelivered}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
