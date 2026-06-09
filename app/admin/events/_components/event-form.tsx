"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
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
  CardFooter,
} from "@/components/ui/card";

const IS_DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";

interface EventFormProps {
  clients: Client[];
}

export function EventForm({ clients }: EventFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventInput>({
    resolver: zodResolver(eventSchema) as Resolver<EventInput>,
    defaultValues: {
      max_attendees: 100,
      client_id: clients[0]?.id,
    },
  });

  const clientId = watch("client_id");

  function onSubmit(values: EventInput) {
    if (!IS_DEV_MODE) {
      toast.info("Connect Nhost or enable dev mode to create events.");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("client_id", values.client_id);
    formData.append("start_time", new Date(values.start_time).toISOString());
    formData.append("end_time", new Date(values.end_time).toISOString());
    formData.append("max_attendees", String(values.max_attendees));
    if (values.venue_name) formData.append("venue_name", values.venue_name);

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid gap-4 pt-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Event name</Label>
            <Input
              id="name"
              placeholder="Sarah & James Wedding"
              {...register("name")}
            />
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
              <p className="text-sm text-destructive">
                {errors.client_id.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="start_time">Start time</Label>
              <Input
                id="start_time"
                type="datetime-local"
                {...register("start_time")}
              />
              {errors.start_time && (
                <p className="text-sm text-destructive">
                  {errors.start_time.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end_time">End time</Label>
              <Input
                id="end_time"
                type="datetime-local"
                {...register("end_time")}
              />
              {errors.end_time && (
                <p className="text-sm text-destructive">
                  {errors.end_time.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="venue_name">Venue (optional)</Label>
            <Input id="venue_name" {...register("venue_name")} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="max_attendees">Max concurrent attendees</Label>
            <Input
              id="max_attendees"
              type="number"
              min={1}
              {...register("max_attendees")}
            />
            {errors.max_attendees && (
              <p className="text-sm text-destructive">
                {errors.max_attendees.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating…" : "Create event"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
