"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey: string;
  placeholder?: string;
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  placeholder = "Search…",
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center">
      <Input
        placeholder={placeholder}
        value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
        onChange={(e) =>
          table.getColumn(searchKey)?.setFilterValue(e.target.value)
        }
        className="max-w-sm"
      />
    </div>
  );
}
