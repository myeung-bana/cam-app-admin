"use client";

import { NhostProvider } from "@nhost/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { nhostBrowser } from "@/lib/nhost-client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NhostProvider nhost={nhostBrowser}>
      <TooltipProvider>
        {children}
        <Toaster richColors closeButton />
      </TooltipProvider>
    </NhostProvider>
  );
}
