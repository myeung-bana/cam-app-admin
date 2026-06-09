"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, MoreHorizontal } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
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

function EventRowActions({ eventId }: { eventId: string }) {
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
          Open workspace
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/admin/events/${eventId}/media`)}>
          Media gallery
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function buildColumns(clientName: string): ColumnDef<Event>[] {
  return [
    {
      accessorKey: "name",
      header: "Event",
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <Link
            href={`/admin/events/${row.original.id}`}
            className="inline-flex items-center gap-1 font-medium hover:underline"
          >
            {row.original.name}
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </Link>
          <p className="text-xs text-muted-foreground">
            Client: {clientName}
          </p>
        </div>
      ),
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
      accessorKey: "venue_name",
      header: "Venue",
      cell: ({ row }) => row.original.venue_name ?? "—",
    },
    {
      accessorKey: "start_time",
      header: "Start",
      cell: ({ row }) => formatDateTime(row.original.start_time),
    },
    {
      accessorKey: "end_time",
      header: "End",
      cell: ({ row }) => formatDateTime(row.original.end_time),
    },
    {
      id: "actions",
      cell: ({ row }) => <EventRowActions eventId={row.original.id} />,
    },
  ];
}

interface ClientEventsTableProps {
  events: Event[];
  clientId: string;
  clientName: string;
}

export function ClientEventsTable({
  events,
  clientId,
  clientName,
}: ClientEventsTableProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-10 text-center">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{clientName}</span> is
          not linked to any events yet.
        </p>
        <Link
          href={`/admin/events/new?clientId=${clientId}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Create the first event for this client
        </Link>
      </div>
    );
  }

  return (
    <DataTable
      columns={buildColumns(clientName)}
      data={events}
      searchKey="name"
      searchPlaceholder="Search this client's events…"
    />
  );
}
