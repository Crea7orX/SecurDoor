"use client";

import { type DeviceResponse } from "@/lib/validations/device";
import { type ColumnDef } from "@tanstack/react-table";

export function getColumns(): ColumnDef<DeviceResponse>[] {
  return [
    {
      accessorKey: "name",
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "emergencyState",
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
