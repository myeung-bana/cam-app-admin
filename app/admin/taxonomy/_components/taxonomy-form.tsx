"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  eventTypeTaxonomySchema,
  challengeTaxonomySchema,
  type EventTypeTaxonomyInput,
  type ChallengeTaxonomyInput,
} from "@/lib/schemas/taxonomy.schema";
import {
  createTaxonomyAction,
  updateTaxonomyAction,
} from "../_actions/taxonomy.actions";
import { getTaxonomyConfig } from "@/lib/taxonomy/registry";
import type {
  TaxonomyKind,
  EventTypeTaxonomy,
  ChallengeTaxonomy,
} from "@/lib/types";
import type { TaxonomyOption } from "@/lib/data/taxonomy";
import { getActionErrorMessage } from "@/lib/utils/server-action-error";
import { SlugInput } from "@/components/shared/slug-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TaxonomyFormProps {
  kind: TaxonomyKind;
  item?: EventTypeTaxonomy | ChallengeTaxonomy;
  eventTypeOptions?: TaxonomyOption[];
}

export function TaxonomyForm({
  kind,
  item,
  eventTypeOptions = [],
}: TaxonomyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(item);
  const config = getTaxonomyConfig(kind);
  const isChallenge = kind === "challenges";
  const challengeItem = isChallenge ? (item as ChallengeTaxonomy | undefined) : undefined;

  const eventForm = useForm<EventTypeTaxonomyInput>({
    resolver: zodResolver(eventTypeTaxonomySchema) as Resolver<EventTypeTaxonomyInput>,
    defaultValues: {
      slug: item?.slug ?? "",
      label: item?.label ?? "",
      description: item?.description ?? "",
      sort_order: item?.sort_order ?? 0,
      active: item?.active ?? true,
    },
  });

  const challengeForm = useForm<ChallengeTaxonomyInput>({
    resolver: zodResolver(challengeTaxonomySchema) as Resolver<ChallengeTaxonomyInput>,
    defaultValues: {
      slug: item?.slug ?? "",
      label: item?.label ?? "",
      description: item?.description ?? "",
      icon: challengeItem?.icon ?? "📸",
      is_required: challengeItem?.is_required ?? false,
      event_type_slug: challengeItem?.event_type_slug ?? "",
      sort_order: item?.sort_order ?? 0,
      active: item?.active ?? true,
    },
  });

  function submitEventType(values: EventTypeTaxonomyInput) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== "") formData.append(key, String(value));
    });
    formData.append("active", String(values.active ?? true));

    startTransition(async () => {
      try {
        if (isEditing && item) {
          await updateTaxonomyAction(kind, item.id, formData);
          toast.success("Saved");
        } else {
          await createTaxonomyAction(kind, formData);
        }
      } catch (err) {
        toast.error(getActionErrorMessage(err, "Failed to save"));
      }
    });
  }

  function submitChallenge(values: ChallengeTaxonomyInput) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        formData.append(key, String(value));
      }
    });
    formData.append("is_required", String(values.is_required ?? false));
    formData.append("active", String(values.active ?? true));

    startTransition(async () => {
      try {
        if (isEditing && item) {
          await updateTaxonomyAction(kind, item.id, formData);
          toast.success("Saved");
        } else {
          await createTaxonomyAction(kind, formData);
        }
      } catch (err) {
        toast.error(getActionErrorMessage(err, "Failed to save"));
      }
    });
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="text-base">
          {isEditing ? `Edit ${config.singularLabel}` : `New ${config.singularLabel}`}
        </CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>

      {isChallenge ? (
        <form onSubmit={challengeForm.handleSubmit(submitChallenge)}>
          <CardContent className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="label">Label</Label>
                <Input id="label" {...challengeForm.register("label")} />
                {challengeForm.formState.errors.label && (
                  <p className="text-sm text-destructive">
                    {challengeForm.formState.errors.label.message}
                  </p>
                )}
              </div>
              <SlugInput
                id="slug"
                value={challengeForm.watch("slug")}
                onChange={(value) =>
                  challengeForm.setValue("slug", value, { shouldValidate: true })
                }
                onBlur={() => challengeForm.trigger("slug")}
                error={challengeForm.formState.errors.slug?.message}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={2} {...challengeForm.register("description")} />
            </div>
            <div className="grid gap-2 sm:max-w-[8rem]">
              <Label htmlFor="sort_order">Sort order</Label>
              <Input id="sort_order" type="number" min={0} {...challengeForm.register("sort_order")} />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={challengeForm.watch("active")}
                onCheckedChange={(v) => challengeForm.setValue("active", v)}
              />
              <Label>Active</Label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icon">Emoji icon</Label>
              <Input id="icon" className="w-20" {...challengeForm.register("icon")} />
            </div>
            <div className="grid gap-2">
              <Label>Linked event type</Label>
              <Select
                value={challengeForm.watch("event_type_slug") || "all"}
                onValueChange={(v) =>
                  challengeForm.setValue(
                    "event_type_slug",
                    v === "all" ? "" : v ?? ""
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All event types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All event types</SelectItem>
                  {eventTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={challengeForm.watch("is_required")}
                onCheckedChange={(v) => challengeForm.setValue("is_required", v)}
              />
              <Label>Required by default when loaded as template</Label>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : isEditing ? "Save changes" : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </CardFooter>
        </form>
      ) : (
        <form onSubmit={eventForm.handleSubmit(submitEventType)}>
          <CardContent className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="label">Label</Label>
                <Input id="label" {...eventForm.register("label")} />
                {eventForm.formState.errors.label && (
                  <p className="text-sm text-destructive">
                    {eventForm.formState.errors.label.message}
                  </p>
                )}
              </div>
              <SlugInput
                id="slug"
                value={eventForm.watch("slug")}
                onChange={(value) =>
                  eventForm.setValue("slug", value, { shouldValidate: true })
                }
                onBlur={() => eventForm.trigger("slug")}
                error={eventForm.formState.errors.slug?.message}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={2} {...eventForm.register("description")} />
            </div>
            <div className="grid gap-2 sm:max-w-[8rem]">
              <Label htmlFor="sort_order">Sort order</Label>
              <Input id="sort_order" type="number" min={0} {...eventForm.register("sort_order")} />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={eventForm.watch("active")}
                onCheckedChange={(v) => eventForm.setValue("active", v)}
              />
              <Label>Active</Label>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : isEditing ? "Save changes" : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}
