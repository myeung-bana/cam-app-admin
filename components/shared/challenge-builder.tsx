"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  saveChallengesAction,
  loadChallengeTemplateAction,
} from "@/app/admin/events/_actions/challenge.actions";
import type { Challenge, EventType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ChallengeRow = Omit<Challenge, "event_id">;

interface ChallengeBuilderProps {
  eventId: string;
  eventType: EventType;
  initialChallenges: Challenge[];
}

function emptyChallenge(order: number): ChallengeRow {
  return {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    icon: "📸",
    is_required: false,
    sort_order: order,
  };
}

export function ChallengeBuilder({
  eventId,
  eventType,
  initialChallenges,
}: ChallengeBuilderProps) {
  const [challenges, setChallenges] = useState<ChallengeRow[]>(
    initialChallenges.map(({ event_id, ...rest }) => {
      void event_id;
      return rest;
    })
  );
  const [isPending, startTransition] = useTransition();

  function updateRow(index: number, patch: Partial<ChallengeRow>) {
    setChallenges((prev) =>
      prev.map((c, i) => (i === index ? { ...c, ...patch } : c))
    );
  }

  function moveRow(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= challenges.length) return;
    setChallenges((prev) => {
      const copy = [...prev];
      [copy[index], copy[next]] = [copy[next], copy[index]];
      return copy.map((c, i) => ({ ...c, sort_order: i }));
    });
  }

  function removeRow(index: number) {
    setChallenges((prev) =>
      prev.filter((_, i) => i !== index).map((c, i) => ({ ...c, sort_order: i }))
    );
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await saveChallengesAction(eventId, challenges);
        toast.success("Challenges saved");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to save");
      }
    });
  }

  function handleLoadTemplate() {
    startTransition(async () => {
      try {
        await loadChallengeTemplateAction(eventId, eventType);
        toast.success("Template loaded");
        window.location.reload();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load template");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Select value={eventType} disabled>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={eventType}>{eventType}</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={isPending} onClick={handleLoadTemplate}>
            Load template
          </Button>
          <Button size="sm" disabled={isPending} onClick={handleSave}>
            Save challenges
          </Button>
        </div>
      </div>

      {challenges.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10">
            <p className="text-sm text-muted-foreground">No challenges yet.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setChallenges([emptyChallenge(0)])}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add challenge
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {challenges.map((challenge, index) => (
            <Card key={challenge.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Challenge {index + 1}
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={index === 0}
                    onClick={() => moveRow(index, -1)}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={index === challenges.length - 1}
                    onClick={() => moveRow(index, 1)}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRow(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Title</Label>
                  <Input
                    value={challenge.title}
                    onChange={(e) => updateRow(index, { title: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Emoji</Label>
                  <Input
                    value={challenge.icon}
                    onChange={(e) => updateRow(index, { icon: e.target.value })}
                    className="w-20"
                  />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label>Description</Label>
                  <Input
                    value={challenge.description}
                    onChange={(e) =>
                      updateRow(index, { description: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={challenge.is_required}
                    onCheckedChange={(checked) =>
                      updateRow(index, { is_required: checked })
                    }
                  />
                  <Label>Required challenge</Label>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setChallenges((prev) => [...prev, emptyChallenge(prev.length)])
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add challenge
          </Button>
        </div>
      )}
    </div>
  );
}
