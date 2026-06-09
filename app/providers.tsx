"use client";

import { NhostProvider } from "@nhost/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { nhostBrowser } from "@/lib/nhost-client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NhostProvider nhost={nhostBrowser}>
      {children}
      <Toaster richColors closeButton />
    </NhostProvider>
  );
}
