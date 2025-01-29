"use client";

import type { LogResponse } from "@/lib/validations/log";
import { type ColumnDef } from "@tanstack/react-table";

export function getColumns(): ColumnDef<LogResponse>[] {
  return [
    {
      accessorKey: "action",
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "actorId",
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "createdAt",
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
