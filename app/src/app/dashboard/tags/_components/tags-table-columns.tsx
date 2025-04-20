"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { FormattedDate } from "@/components/data-table/formatted-date";
import { TagActions } from "@/components/tags/tag-actions";
import { Badge } from "@/components/ui/badge";
import {
  type TagResponse,
  type TagResponseExpand,
} from "@/lib/validations/tag";
import { type ColumnDef } from "@tanstack/react-table";
import { Microchip } from "lucide-react";

const translationKey = "Tag.filter";

export function getColumns(): ColumnDef<TagResponse & TagResponseExpand>[] {
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
        <div className="xl:min-w-64">
          <Badge variant="info" className="text-md">
            {row.getValue("name")}
          </Badge>
        </div>
      ),
      meta: {
        headerName: `${translationKey}.name.label`,
      },
    },
    {
      accessorKey: "devicesCount",
      enableSorting: false,
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={`${translationKey}.devices_count.label`}
        />
      ),
      cell: ({ row }) => {
        const devicesCount = Number(row.getValue("devicesCount"));

        return (
          <Badge
            variant={devicesCount == 0 ? "warning" : "success"}
            className="text-md"
          >
            <Microchip className="mr-1 size-4" />
            <span>{devicesCount}</span>
          </Badge>
        );
      },
      meta: {
        headerName: `${translationKey}.devices_count.label`,
      },
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
        <TagActions key={row.original.id} tag={row.original} />
      ),
    },
  ];
}
