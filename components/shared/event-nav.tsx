"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { tabsListVariants } from "@/components/ui/tabs";

const EVENT_TABS = [
  { label: "Overview", segment: "" },
  { label: "Media", segment: "/media" },
  { label: "Challenges", segment: "/challenges" },
  { label: "Reel", segment: "/reel" },
] as const;

interface EventNavProps {
  eventId: string;
}

export function EventNav({ eventId }: EventNavProps) {
  const pathname = usePathname();
  const basePath = `/admin/events/${eventId}`;

  return (
    <nav className={cn(tabsListVariants(), "w-fit")}>
      {EVENT_TABS.map((tab) => {
        const href = `${basePath}${tab.segment}`;
        const isActive =
          tab.segment === ""
            ? pathname === basePath
            : pathname.startsWith(href);

        return (
          <Link
            key={tab.label}
            href={href}
            className={cn(
              "relative inline-flex h-[calc(100%-1px)] items-center justify-center rounded-md border border-transparent px-3 py-1 text-sm font-medium whitespace-nowrap transition-all",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-foreground/60 hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
