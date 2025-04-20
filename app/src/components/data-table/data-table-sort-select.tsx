"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { type Table as TanstackTable } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import * as React from "react";

interface DataTableSortSelectProps<TData>
  extends React.ComponentProps<typeof SelectTrigger> {
  table: TanstackTable<TData>;
}

export function DataTableSortSelect<TData>({
  className,
  table,
  ...props
}: DataTableSortSelectProps<TData>) {
  const t = useTranslations();

  const canSort = React.useMemo(
    () => table.getAllColumns().some((column) => column.getCanSort()),
    [table],
  );
  const initialSortedColumn = React.useMemo(
    () => table.getAllColumns().find((column) => column.getIsSorted()),
    [table],
  );

  const onValueChange = (value: string) => {
    table.getColumn(value)?.toggleSorting(true);
  };

  if (!canSort) return null;

  return (
    <Select
      defaultValue={initialSortedColumn?.id}
      onValueChange={onValueChange}
    >
      <SelectTrigger className={cn("h-8 w-fit gap-2", className)} {...props}>
        {t("Data_Table.sort_by")}
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {table.getAllColumns().map(
          (column) =>
            column.getCanSort() && (
              <SelectItem key={column.id} value={column.id}>
                {t(column.columnDef.meta?.headerName) ?? t(column.id)}
              </SelectItem>
            ),
        )}
      </SelectContent>
    </Select>
  );
}
