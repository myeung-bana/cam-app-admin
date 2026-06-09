import { Suspense } from "react";
import { LoginForm } from "./_components/login-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40">
      <div className="w-full max-w-sm px-4">
        <Suspense fallback={<Skeleton className="h-80 w-full rounded-lg" />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
