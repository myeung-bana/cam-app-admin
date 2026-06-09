"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { CalendarDays, MoreHorizontal } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { EventStatusBadge } from "@/components/shared/status-badge";
import { formatDateTime } from "@/lib/utils/format";
import type { Event } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function EventActions({ eventId }: { eventId: string }) {
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
        <DropdownMenuItem onClick={() => router.push(`/admin/events/${eventId}`)}>
          View
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/admin/events/${eventId}/media`)}
        >
          Media gallery
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/admin/events/${eventId}/live`)}
        >
          Live dashboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "name",
    header: "Event",
    cell: ({ row }) => (
      <Link
        href={`/admin/events/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "client.name",
    header: "Client",
    cell: ({ row }) => row.original.client.name,
  },
  {
    accessorKey: "event_type",
    header: "Type",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.event_type}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <EventStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "start_time",
    header: "Start",
    cell: ({ row }) => formatDateTime(row.original.start_time),
  },
  {
    accessorKey: "max_attendees",
    header: "Cap",
  },
  {
    id: "actions",
    cell: ({ row }) => <EventActions eventId={row.original.id} />,
  },
];

interface EventTableProps {
  events: Event[];
}

export function EventTable({ events }: EventTableProps) {
  if (events.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="No events yet"
        description="Create an event to generate a QR code and start collecting guest photos."
        action={{ label: "Create event", href: "/admin/events/new" }}
      />
    );
  }

  return (
    <DataTable
      columns={columns}
      data={events}
      searchKey="name"
      searchPlaceholder="Search events…"
    />
  );
}
