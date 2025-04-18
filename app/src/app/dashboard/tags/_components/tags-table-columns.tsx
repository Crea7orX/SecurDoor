"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { FormattedDate } from "@/components/data-table/formatted-date";
import { TagActions } from "@/components/tags/tag-actions";
import { Badge } from "@/components/ui/badge";
import { type TagResponse } from "@/lib/validations/tag";
import { type ColumnDef } from "@tanstack/react-table";

const translationKey = "Tag.filter";

export function getColumns(): ColumnDef<TagResponse>[] {
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
