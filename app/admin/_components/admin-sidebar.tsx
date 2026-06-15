"use client";

import { AdminNavItems } from "./admin-nav-items";

export function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-sidebar lg:flex lg:flex-col">
      <div className="flex h-14 items-center gap-2 border-b px-6">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
          M
        </div>
        <span className="font-semibold tracking-tight">Memo</span>
      </div>
      <nav className="flex flex-1 flex-col p-4">
        <AdminNavItems />
      </nav>
    </aside>
  );
}
