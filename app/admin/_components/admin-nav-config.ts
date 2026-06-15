import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  LayoutDashboard,
  Settings,
  Tags,
  UserCog,
  Users,
} from "lucide-react";

export type NavLinkItem = {
  type: "link";
  label: string;
  href: string;
  icon: LucideIcon;
};

export type NavParentItem = {
  type: "parent";
  label: string;
  href: string;
  icon: LucideIcon;
  children: { label: string; href: string }[];
};

export type NavItem = NavLinkItem | NavParentItem;

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Operations",
    items: [
      { type: "link", label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { type: "link", label: "Events", href: "/admin/events", icon: CalendarDays },
    ],
  },
  {
    label: "CRM",
    items: [{ type: "link", label: "Clients", href: "/admin/clients", icon: Users }],
  },
  {
    label: "System",
    items: [
      {
        type: "parent",
        label: "Taxonomy",
        href: "/admin/taxonomy",
        icon: Tags,
        children: [
          { label: "Event Types", href: "/admin/taxonomy/event-types" },
          { label: "Challenges", href: "/admin/taxonomy/challenges" },
        ],
      },
      { type: "link", label: "Users", href: "/admin/users", icon: UserCog },
      { type: "link", label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function isNavItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isNavParentActive(pathname: string, item: NavParentItem): boolean {
  return (
    isNavItemActive(pathname, item.href) ||
    item.children.some((child) => isNavItemActive(pathname, child.href))
  );
}
