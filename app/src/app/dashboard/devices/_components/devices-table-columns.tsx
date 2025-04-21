"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { FormattedDate } from "@/components/data-table/formatted-date";
import { DeviceStateBadges } from "@/components/devices/access/device-state-badges";
import { DeviceStatusBadges } from "@/components/devices/access/device-status-badges";
import { DeviceStatusDot } from "@/components/devices/access/device-status-dot";
import { DeviceActions } from "@/components/devices/device-actions";
import { type DeviceResponse } from "@/lib/validations/device";
import { type ColumnDef } from "@tanstack/react-table";
import * as React from "react";

const translationKey = "Device.filter";

interface Props {
  now: Date;
}

export function getColumns({ now }: Props): ColumnDef<DeviceResponse>[] {
  return [
    {
      accessorKey: "name",
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={`${translationKey}.name.label`}
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3 xl:min-w-64">
          <DeviceStatusDot
            className="size-3"
            status={row.original.state?.status ?? "unknown"}
            lastSeenAt={row.original.state?.lastSeenAt ?? 0}
            now={now}
          />
          <span>{row.getValue("name")}</span>
        </div>
      ),
      meta: {
        headerName: `${translationKey}.name.label`,
      },
    },
    {
      accessorKey: "status",
      enableSorting: false,
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={`${translationKey}.status.label`}
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <DeviceStatusBadges
            lastSeenAt={row.original.state?.lastSeenAt ?? 0}
            status={row.original.state?.status ?? "unknown"}
          />
        </div>
      ),
      meta: {
        headerName: `${translationKey}.status.label`,
      },
    },
    {
      accessorKey: "state",
      enableSorting: false,
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={`${translationKey}.state.label`}
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <DeviceStateBadges
            isLockedState={row.original.state?.isLockedState ?? true}
            emergencyState={row.getValue("emergencyState")}
          />
        </div>
      ),
      meta: {
        headerName: `${translationKey}.state.label`,
      },
    },
    {
      accessorKey: "emergencyState",
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "tagId",
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "createdAt",
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={`${translationKey}.created_at.label`}
        />
      ),
      cell: ({ row }) => (
        <FormattedDate
          date={new Date(Number(row.getValue("createdAt")) * 1000)}
        />
      ),
      meta: {
        headerName: `${translationKey}.created_at.label`,
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DeviceActions key={row.original.id} device={row.original} />
      ),
    },
  ];
}
