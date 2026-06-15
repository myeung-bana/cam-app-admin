"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { useSignOut } from "@nhost/nextjs";
import { cn } from "@/lib/utils";
import type { AuthSession } from "@/lib/types";
import { AdminNavItems } from "./admin-nav-items";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface AdminTopBarProps {
  user: AuthSession["user"];
}

export function AdminTopBar({ user }: AdminTopBarProps) {
  const router = useRouter();
  const { signOut } = useSignOut();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = user.email
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex h-14 items-center justify-between border-b px-4 lg:px-8">
      <div className="flex items-center gap-3 lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            }
          />
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="border-b p-4">
              <SheetTitle className="text-xl font-semibold tracking-tight">
                Memo
              </SheetTitle>
            </SheetHeader>
            <nav className="p-4">
              <AdminNavItems
                onNavigate={() => setMobileOpen(false)}
                linkClassName={(active) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50"
                  )
                }
                subLinkClassName={(active) =>
                  cn(
                    "flex items-center rounded-md px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-accent font-medium text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50"
                  )
                }
              />
            </nav>
          </SheetContent>
        </Sheet>
        <span className="text-xl font-semibold tracking-tight">Memo</span>
      </div>

      <div className="hidden lg:block" />

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">
              {user.displayName ?? user.email}
            </p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              if (process.env.NEXT_PUBLIC_DEV_MODE === "true") {
                await fetch("/api/dev/logout", { method: "POST" });
                router.push("/login");
                router.refresh();
                return;
              }
              signOut();
            }}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
