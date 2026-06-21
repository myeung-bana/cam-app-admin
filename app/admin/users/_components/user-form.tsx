"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  adminUserSchema,
  type AdminUserInput,
} from "@/lib/schemas/admin-user.schema";
import { getActionErrorMessage } from "@/lib/utils/server-action-error";
import { showSuccessToast } from "@/lib/ui/success-toast";
import type { AdminUser } from "@/lib/types";
import {
  createAdminUserAction,
  updateAdminUserAction,
} from "../_actions/user.actions";
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UserFormProps {
  user?: AdminUser;
}

export function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(user);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AdminUserInput>({
    resolver: zodResolver(adminUserSchema) as Resolver<AdminUserInput>,
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: user?.role ?? "admin",
      status: user?.status ?? "active",
      phone: user?.phone ?? "",
      notes: user?.notes ?? "",
    },
  });

  const role = watch("role");
  const status = watch("status");

  function onSubmit(values: AdminUserInput) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        formData.append(key, String(value));
      }
    });

    startTransition(async () => {
      try {
        if (isEditing && user) {
          await updateAdminUserAction(user.id, formData);
          showSuccessToast("adminUserUpdated");
        } else {
          await createAdminUserAction(formData);
        }
      } catch (err) {
        toast.error(getActionErrorMessage(err, "Failed to save user"));
      }
    });
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="text-base">
          {isEditing ? "Edit user" : "Invite admin user"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update profile details and access for this admin user."
            : "Create a new admin account. An invitation email will be sent in production."}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Role</Label>
              <Select
                value={role}
                onValueChange={(v) => {
                  if (v) setValue("role", v as AdminUserInput["role"]);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isEditing && (
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={status}
                  onValueChange={(v) => {
                    if (v) setValue("status", v as AdminUserInput["status"]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" type="tel" {...register("phone")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Internal notes</Label>
            <Textarea id="notes" rows={3} {...register("notes")} />
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Saving…"
              : isEditing
                ? "Save changes"
                : "Send invitation"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
