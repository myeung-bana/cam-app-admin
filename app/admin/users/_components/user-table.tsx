"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, UserCog } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { AdminUserStatusBadge } from "@/components/shared/status-badge";
import { formatDateTime } from "@/lib/utils/format";
import type { AdminUser } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function UserActions({ userId }: { userId: string }) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/admin/users/${userId}`)}>
          View & edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const columns: ColumnDef<AdminUser>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/admin/users/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <AdminUserStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "last_login_at",
    header: "Last login",
    cell: ({ row }) =>
      row.original.last_login_at
        ? formatDateTime(row.original.last_login_at)
        : "Never",
  },
  {
    id: "actions",
    cell: ({ row }) => <UserActions userId={row.original.id} />,
  },
];

interface UserTableProps {
  users: AdminUser[];
}

export function UserTable({ users }: UserTableProps) {
  if (users.length === 0) {
    return (
      <EmptyState
        icon={UserCog}
        title="No admin users"
        description="Invite team members who can access the Memo admin panel."
        action={{ label: "Invite user", href: "/admin/users/new" }}
      />
    );
  }

  return (
    <DataTable
      columns={columns}
      data={users}
      searchKey="name"
      searchPlaceholder="Search admin users…"
    />
  );
}
