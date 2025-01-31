"use client";

import { type CardResponse } from "@/lib/validations/card";
import { type ColumnDef } from "@tanstack/react-table";

export function getColumns(): ColumnDef<CardResponse>[] {
  return [
    {
      accessorKey: "holder",
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "active",
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
