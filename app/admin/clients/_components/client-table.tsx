"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Users } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils/format";
import type { Client } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ClientActions({ clientId }: { clientId: string }) {
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
        <DropdownMenuItem onClick={() => router.push(`/admin/clients/${clientId}`)}>
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/admin/clients/${clientId}/edit`)}
        >
          Edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/admin/clients/${row.original.id}`}
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
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.phone ?? "—",
  },
  {
    accessorKey: "wedding_date",
    header: "Wedding date",
    cell: ({ row }) =>
      row.original.wedding_date
        ? formatDate(row.original.wedding_date)
        : "—",
  },
  {
    id: "actions",
    cell: ({ row }) => <ClientActions clientId={row.original.id} />,
  },
];

interface ClientTableProps {
  clients: Client[];
}

export function ClientTable({ clients }: ClientTableProps) {
  if (clients.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No clients yet"
        description="Create your first client profile to start managing wedding events."
        action={{ label: "Add client", href: "/admin/clients/new" }}
      />
    );
  }

  return (
    <DataTable
      columns={columns}
      data={clients}
      searchKey="name"
      searchPlaceholder="Search clients…"
    />
  );
}
