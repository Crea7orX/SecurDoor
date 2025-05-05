"use client";

import { BiometricStatusBadge } from "@/components/biometrics/access/biometric-status-badge";
import { BiometricActions } from "@/components/biometrics/data-table/biometric-actions";
import { BiometricIndividualColumn } from "@/components/biometrics/data-table/biometric-individual-column";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { FormattedDate } from "@/components/data-table/formatted-date";
import type { BiometricResponse } from "@/lib/validations/biometric";
import { type ColumnDef } from "@tanstack/react-table";

const translationKey = "Biometric.filter";

export function getColumns(): ColumnDef<BiometricResponse>[] {
  return [
    {
      accessorKey: "individual",
      enableHiding: false,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={`${translationKey}.individual.label`}
        />
      ),
      cell: ({ row }) => (
        <div className="xl:min-w-64">
          <BiometricIndividualColumn individual={row.getValue("individual")} />
        </div>
      ),
      meta: {
        headerName: `${translationKey}.individual.label`,
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
      cell: ({ row }) => <BiometricStatusBadge active={row.original.active} />,
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
        <BiometricActions key={row.original.id} biometric={row.original} />
      ),
    },
  ];
}
