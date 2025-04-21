"use client";

import { CardStatusBadge } from "@/components/cards/access/card-status-badge";
import { CardActions } from "@/components/cards/card-actions";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { FormattedDate } from "@/components/data-table/formatted-date";
import { type CardResponse } from "@/lib/validations/card";
import { type ColumnDef } from "@tanstack/react-table";

const translationKey = "Card.filter";

export function getColumns(): ColumnDef<CardResponse>[] {
  return [
    {
      accessorKey: "holder",
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={`${translationKey}.holder.label`}
        />
      ),
      cell: ({ row }) => (
        <span className="xl:min-w-64">{row.getValue("holder")}</span>
      ),
      meta: {
        headerName: `${translationKey}.holder.label`,
      },
    },
    {
      accessorKey: "active",
      enableSorting: false,
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={`${translationKey}.active.label`}
        />
      ),
      cell: ({ row }) => <CardStatusBadge active={row.original.active} />,
      meta: {
        headerName: `${translationKey}.active.label`,
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
        <CardActions key={row.original.id} card={row.original} />
      ),
    },
  ];
}
