"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  FLASH_QUERY_PARAM,
  isSuccessMessageKey,
  showSuccessToast,
} from "@/lib/ui/success-toast";

export function FlashToast() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const handled = useRef<string | null>(null);

  useEffect(() => {
    const flash = searchParams.get(FLASH_QUERY_PARAM);
    if (!flash || !isSuccessMessageKey(flash)) return;

    const signature = `${pathname}?${flash}`;
    if (handled.current === signature) return;
    handled.current = signature;

    showSuccessToast(flash);

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete(FLASH_QUERY_PARAM);
    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  return null;
}
