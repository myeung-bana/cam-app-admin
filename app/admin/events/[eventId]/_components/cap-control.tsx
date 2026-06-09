"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { adjustEventCapAction } from "../../_actions/event.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CapControlProps {
  eventId: string;
  currentCap: number;
}

export function CapControl({ eventId, currentCap }: CapControlProps) {
  const [cap, setCap] = useState(String(currentCap));
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    const value = parseInt(cap, 10);
    if (isNaN(value) || value < 1) {
      toast.error("Enter a valid cap");
      return;
    }
    startTransition(async () => {
      try {
        await adjustEventCapAction(eventId, value);
        toast.success("Attendee cap updated");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update cap");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Attendee cap</CardTitle>
        <CardDescription>
          Adjust the concurrent attendee limit without regenerating the QR code.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-end gap-3">
        <div className="grid gap-2">
          <Label htmlFor="cap">Current cap</Label>
          <Input
            id="cap"
            type="number"
            min={1}
            value={cap}
            onChange={(e) => setCap(e.target.value)}
            className="w-32"
          />
        </div>
        <Button size="sm" disabled={isPending} onClick={handleSave}>
          Save cap
        </Button>
      </CardContent>
    </Card>
  );
}
