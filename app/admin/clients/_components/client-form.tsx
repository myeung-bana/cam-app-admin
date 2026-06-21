"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { clientSchema, type ClientInput } from "@/lib/schemas/client.schema";
import type { Client } from "@/lib/types";
import {
  createClientAction,
  updateClientAction,
} from "../_actions/client.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

import type { TaxonomyOption } from "@/lib/data/taxonomy";
import { getActionErrorMessage } from "@/lib/utils/server-action-error";

interface ClientFormProps {
  client?: Client;
  eventTypeOptions: TaxonomyOption[];
}

export function ClientForm({ client, eventTypeOptions }: ClientFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(client);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClientInput>({
    resolver: zodResolver(clientSchema) as Resolver<ClientInput>,
    defaultValues: {
      name: client?.name ?? "",
      email: client?.email ?? "",
      organisation: client?.organisation ?? "",
      phone: client?.phone ?? "",
      wedding_date: client?.wedding_date ?? "",
      event_type_preference: client?.event_type_preference ?? undefined,
      notes: client?.notes ?? "",
    },
  });

  const eventType = watch("event_type_preference");

  function onSubmit(values: ClientInput) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        formData.append(key, String(value));
      }
    });

    startTransition(async () => {
      try {
        if (isEditing && client) {
          await updateClientAction(client.id, formData);
          toast.success("Client updated");
        } else {
          await createClientAction(formData);
        }
      } catch (err) {
        toast.error(getActionErrorMessage(err, "Failed to save client"));
      }
    });
  }

  return (
    <Card className="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid gap-4 pt-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="organisation">Organisation</Label>
            <Input id="organisation" {...register("organisation")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" {...register("phone")} />
          </div>
          <div className="grid gap-2">
            <Label>Event type preference</Label>
            <Select
              value={eventType ?? ""}
              onValueChange={(v) => {
                if (v) setValue("event_type_preference", v as ClientInput["event_type_preference"]);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
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
          <div className="grid gap-2">
            <Label htmlFor="wedding_date">Key date (optional)</Label>
            <Input id="wedding_date" type="date" {...register("wedding_date")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Internal notes</Label>
            <Textarea id="notes" rows={3} {...register("notes")} />
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : isEditing ? "Save changes" : "Create client"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
