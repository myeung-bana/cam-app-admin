"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { eventSchema, type EventInput } from "@/lib/schemas/event.schema";
import type { Client } from "@/lib/types";
import { createEventAction } from "../_actions/event.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

import type { TaxonomyOption } from "@/lib/data/taxonomy";

const IS_DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";

interface EventFormProps {
  clients: Client[];
  eventTypeOptions: TaxonomyOption[];
}

export function EventForm({ clients, eventTypeOptions }: EventFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedClient = searchParams.get("clientId") ?? clients[0]?.id;
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<EventInput>({
    resolver: zodResolver(eventSchema) as Resolver<EventInput>,
    defaultValues: {
      max_attendees: 150,
      client_id: preselectedClient,
      event_type: eventTypeOptions[0]?.value ?? "wedding",
      accent_color: "#6366f1",
    },
  });

  const clientId = watch("client_id");
  const eventType = watch("event_type");

  async function goToStep2() {
    const valid = await trigger([
      "name",
      "client_id",
      "event_type",
      "start_time",
      "end_time",
      "max_attendees",
      "venue_name",
    ]);
    if (valid) setStep(2);
  }

  function onSubmit(values: EventInput) {
    if (!IS_DEV_MODE) {
      toast.info("Connect Nhost or enable dev mode to create events.");
      return;
    }

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        formData.append(key, String(value));
      }
    });

    startTransition(async () => {
      try {
        await createEventAction(formData);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to create event");
      }
    });
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Create event</CardTitle>
        <CardDescription>
          Step {step} of 2 — {step === 1 ? "Basics" : "Branding"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid gap-4">
          {step === 1 && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="name">Event name</Label>
                <Input id="name" placeholder="Sarah & James Wedding" {...register("name")} />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label>Client</Label>
                <Select
                  value={clientId}
                  onValueChange={(value) => {
                    if (value) setValue("client_id", value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("client_id")} />
                {errors.client_id && (
                  <p className="text-sm text-destructive">{errors.client_id.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label>Event type</Label>
                <Select
                  value={eventType}
                  onValueChange={(value) => {
                    if (value) setValue("event_type", value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypeOptions.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="start_time">Start time</Label>
                  <Input id="start_time" type="datetime-local" {...register("start_time")} />
                  {errors.start_time && (
                    <p className="text-sm text-destructive">{errors.start_time.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end_time">End time</Label>
                  <Input id="end_time" type="datetime-local" {...register("end_time")} />
                  {errors.end_time && (
                    <p className="text-sm text-destructive">{errors.end_time.message}</p>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="venue_name">Venue (optional)</Label>
                <Input id="venue_name" {...register("venue_name")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max_attendees">Attendee cap</Label>
                <Input id="max_attendees" type="number" min={1} {...register("max_attendees")} />
                {errors.max_attendees && (
                  <p className="text-sm text-destructive">{errors.max_attendees.message}</p>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="accent_color">Accent colour</Label>
                <div className="flex gap-2">
                  <Input
                    id="accent_color"
                    type="color"
                    className="h-10 w-16 cursor-pointer p-1"
                    {...register("accent_color")}
                  />
                  <Input {...register("accent_color")} placeholder="#6366f1" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cover_image_url">Cover image URL (optional)</Label>
                <Input
                  id="cover_image_url"
                  placeholder="https://..."
                  {...register("cover_image_url")}
                />
                <p className="text-xs text-muted-foreground">
                  Used on the guest entry screen. Upload via Nhost Storage in production.
                </p>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          {step === 2 ? (
            <>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating…" : "Create event"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
            </>
          ) : (
            <>
              <Button type="button" onClick={goToStep2}>
                Continue to branding
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
