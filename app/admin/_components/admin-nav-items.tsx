"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  NAV_GROUPS,
  isNavItemActive,
  isNavParentActive,
  type NavItem,
} from "./admin-nav-config";

interface AdminNavItemsProps {
  onNavigate?: () => void;
  className?: string;
  linkClassName?: (active: boolean) => string;
  subLinkClassName?: (active: boolean) => string;
}

function NavLink({
  item,
  pathname,
  onNavigate,
  linkClassName,
}: {
  item: Extract<NavItem, { type: "link" }>;
  pathname: string;
  onNavigate?: () => void;
  linkClassName: (active: boolean) => string;
}) {
  const isActive = isNavItemActive(pathname, item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={linkClassName(isActive)}
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </Link>
  );
}

function NavParent({
  item,
  pathname,
  onNavigate,
  linkClassName,
  subLinkClassName,
}: {
  item: Extract<NavItem, { type: "parent" }>;
  pathname: string;
  onNavigate?: () => void;
  linkClassName: (active: boolean) => string;
  subLinkClassName: (active: boolean) => string;
}) {
  const isParentActive = isNavParentActive(pathname, item);
  const Icon = item.icon;

  return (
    <div className="space-y-0.5">
      <Link
        href={item.href}
        onClick={onNavigate}
        className={linkClassName(isParentActive)}
      >
        <Icon className="h-4 w-4" />
        {item.label}
      </Link>
      <div className="ml-4 space-y-0.5 border-l border-sidebar-border pl-3">
        {item.children.map((child) => {
          const isChildActive = isNavItemActive(pathname, child.href);
          return (
            <Link
              key={child.href}
              href={child.href}
              onClick={onNavigate}
              className={subLinkClassName(isChildActive)}
            >
              {child.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function AdminNavItems({
  onNavigate,
  className,
  linkClassName = (active) =>
    cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
      active
        ? "bg-sidebar-accent text-sidebar-accent-foreground"
        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
    ),
  subLinkClassName = (active) =>
    cn(
      "flex items-center rounded-md px-3 py-1.5 text-sm transition-colors",
      active
        ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
        : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
    ),
}: AdminNavItemsProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col", className)}>
      {NAV_GROUPS.map((group, index) => (
        <div
          key={group.label}
          className={cn(
            "space-y-1",
            index < NAV_GROUPS.length - 1 && "pb-5"
          )}
        >
          <p className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {group.label}
          </p>
          {group.items.map((item) =>
            item.type === "parent" ? (
              <NavParent
                key={item.label}
                item={item}
                pathname={pathname}
                onNavigate={onNavigate}
                linkClassName={linkClassName}
                subLinkClassName={subLinkClassName}
              />
            ) : (
              <NavLink
                key={item.href}
                item={item}
                pathname={pathname}
                onNavigate={onNavigate}
                linkClassName={linkClassName}
              />
            )
          )}
        </div>
      ))}
    </div>
  );
}
