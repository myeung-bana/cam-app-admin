"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/data-table";
import type {
  TaxonomyKind,
  EventTypeTaxonomy,
  ChallengeTaxonomy,
} from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TaxonomyRow = EventTypeTaxonomy | ChallengeTaxonomy;

function RowActions({ kind, id }: { kind: TaxonomyKind; id: string }) {
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
        <DropdownMenuItem
          onClick={() => router.push(`/admin/taxonomy/${kind}/${id}`)}
        >
          View & edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function buildColumns(kind: TaxonomyKind): ColumnDef<TaxonomyRow>[] {
  const base: ColumnDef<TaxonomyRow>[] = [
    {
      accessorKey: "label",
      header: "Label",
      cell: ({ row }) => (
        <Link
          href={`/admin/taxonomy/${kind}/${row.original.id}`}
          className="font-medium hover:underline"
        >
          {row.original.label}
        </Link>
      ),
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
          {row.original.slug}
        </code>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => row.original.description ?? "—",
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.active ? "default" : "secondary"}>
          {row.original.active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      accessorKey: "sort_order",
      header: "Order",
    },
    {
      id: "actions",
      cell: ({ row }) => <RowActions kind={kind} id={row.original.id} />,
    },
  ];

  if (kind === "challenges") {
    base.splice(3, 0, {
      id: "event_type_slug",
      header: "Event type",
      cell: ({ row }) => {
        const item = row.original as ChallengeTaxonomy;
        return item.event_type_slug ? (
          <Badge variant="outline">{item.event_type_slug}</Badge>
        ) : (
          "All types"
        );
      },
    });
    base.splice(4, 0, {
      id: "icon",
      header: "Icon",
      cell: ({ row }) => (row.original as ChallengeTaxonomy).icon,
    });
  }

  return base;
}

interface TaxonomyTableProps {
  kind: TaxonomyKind;
  items: TaxonomyRow[];
}

export function TaxonomyTable({ kind, items }: TaxonomyTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
        No items yet.{" "}
        <Link
          href={`/admin/taxonomy/${kind}/new`}
          className="font-medium text-primary hover:underline"
        >
          Add the first item
        </Link>
      </div>
    );
  }

  return (
    <DataTable
      columns={buildColumns(kind)}
      data={items}
      searchKey="label"
      searchPlaceholder="Search taxonomy…"
    />
  );
}
