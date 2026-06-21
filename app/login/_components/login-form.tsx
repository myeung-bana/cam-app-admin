"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth/auth-context";
import { sanitizeCallbackUrl } from "@/lib/auth/redirects";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginInput = z.infer<typeof loginSchema>;

const IS_DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";

interface LoginFormProps {
  unauthorized?: boolean;
}

export function LoginForm({ unauthorized = false }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshSession } = useAuth();
  const callbackUrl = sanitizeCallbackUrl(searchParams.get("callbackUrl"));
  const [accessDenied, setAccessDenied] = useState(unauthorized);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: IS_DEV_MODE
      ? { email: "admin@example.com", password: "devpassword" }
      : undefined,
  });

  async function onSubmit(values: LoginInput) {
    setAccessDenied(false);
    setAuthError(null);
    setIsSubmitting(true);

    try {
      const endpoint = IS_DEV_MODE ? "/api/dev/login" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok) {
        if (res.status === 403) {
          setAccessDenied(true);
        } else {
          setAuthError(body.error ?? "Invalid credentials.");
        }
        return;
      }

      await refreshSession();
      router.replace(callbackUrl);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Camera className="h-5 w-5" />
        </div>
        <CardTitle>Admin sign in</CardTitle>
        <CardDescription>
          {IS_DEV_MODE
            ? "Dev mode — any email and password (8+ chars) will work."
            : "Sign in with an admin account to manage clients, events, and media."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {IS_DEV_MODE && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              Dev mode active. Default: admin@example.com / devpassword
            </div>
          )}
          {accessDenied && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              This account does not have admin access. Contact your platform
              administrator.
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          {authError && (
            <p className="text-sm text-destructive">{authError}</p>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
