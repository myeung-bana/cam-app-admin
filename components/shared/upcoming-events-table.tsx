"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table/data-table";
import { EventStatusBadge } from "@/components/shared/status-badge";
import { formatDateTime } from "@/lib/utils/format";
import type { Event } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <EventStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "start_time",
    header: "Starts",
    cell: ({ row }) => formatDateTime(row.original.start_time),
  },
];

interface UpcomingEventsTableProps {
  events: Event[];
}

export function UpcomingEventsTable({ events }: UpcomingEventsTableProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Upcoming events (7 days)</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No events scheduled in the next 7 days.
          </p>
        ) : (
          <DataTable columns={columns} data={events} searchKey="name" />
        )}
      </CardContent>
    </Card>
  );
}
