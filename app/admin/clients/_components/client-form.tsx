"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
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
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const IS_DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";

interface ClientFormProps {
  client?: Client;
}

export function ClientForm({ client }: ClientFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(client);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientInput>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client?.name ?? "",
      email: client?.email ?? "",
      phone: client?.phone ?? "",
      wedding_date: client?.wedding_date ?? "",
      notes: client?.notes ?? "",
    },
  });

  function onSubmit(values: ClientInput) {
    if (!IS_DEV_MODE) {
      toast.info("Connect Nhost or enable dev mode to save clients.");
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
        if (isEditing && client) {
          await updateClientAction(client.id, formData);
        } else {
          await createClientAction(formData);
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to save client");
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
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" {...register("phone")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="wedding_date">Wedding date</Label>
            <Input id="wedding_date" type="date" {...register("wedding_date")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" {...register("notes")} />
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Saving…"
              : isEditing
                ? "Save changes"
                : "Create client"}
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
