"use client";

import { NoResultsLabel } from "@/components/data-table/no-results-label";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  type ColumnDef,
  flexRender,
  type Table as TanstackTable,
} from "@tanstack/react-table";
import * as React from "react";

interface DataTableProps<TData, TValue>
  extends React.ComponentProps<typeof Card> {
  table: TanstackTable<TData>;
  columns: ColumnDef<TData, TValue>[];
}

export function DataTable<TData, TValue>({
  className,
  table,
  columns,
  ...props
}: DataTableProps<TData, TValue>) {
  return (
    <Card
      className={cn("w-full overflow-hidden bg-muted p-0.5", className)}
      {...props}
    >
      <Table className="whitespace-nowrap font-medium">
        <TableHeader className="[&_tr]:border-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="p-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="before:z-1 relative bg-card before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:border before:border-border">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="p-4"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "p-4",
                      index === 0 && "first:rounded-tl-xl last:rounded-tr-xl",
                      index === table.getRowModel().rows.length - 1 &&
                        "first:rounded-bl-xl last:rounded-br-xl",
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="relative h-32 text-center"
              >
                <NoResultsLabel className="top-1/2 -translate-x-1/2 -translate-y-1/2" />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
