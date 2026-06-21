import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getAdminSession } from "@/lib/data/auth";
import { sanitizeCallbackUrl } from "@/lib/auth/redirects";
import { UNAUTHORIZED_ERROR } from "@/lib/auth/constants";
import { LoginForm } from "./_components/login-form";
import { Skeleton } from "@/components/ui/skeleton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;
  const session = await getAdminSession();

  if (session) {
    redirect(sanitizeCallbackUrl(params.callbackUrl));
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40">
      <div className="w-full max-w-sm px-4">
        <Suspense fallback={<Skeleton className="h-80 w-full rounded-lg" />}>
          <LoginForm
            unauthorized={params.error === UNAUTHORIZED_ERROR}
          />
        </Suspense>
      </div>
    </main>
  );
}
