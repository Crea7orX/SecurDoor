"use client";

import { getColumns } from "@/app/dashboard/devices/_components/devices-table-columns";
import DevicesLoading from "@/app/dashboard/devices/loading";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { NoResultsLabel } from "@/components/data-table/no-results-label";
import {
  DeviceCard,
  DeviceCardSkeleton,
} from "@/components/devices/device-card";
import { DeviceEmergencyCountAlert } from "@/components/devices/device-emergency-count-alert";
import { Button } from "@/components/ui/button";
import { useGetAllDevicesQuery } from "@/hooks/api/devices/use-get-all-devices-query";
import { useDataTable } from "@/hooks/use-data-table";
import { useNow } from "@/hooks/use-now";
import { cn } from "@/lib/utils";
import { type DeviceResponse } from "@/lib/validations/device";
import type { DataTableFilterField, SearchParams } from "@/types/data-table";
import { BellElectric, Construction, PlusCircle } from "lucide-react";
import Link from "next/link";
import * as React from "react";

interface DevicesPageProps {
  searchParams: SearchParams;
}

export default function DevicesPage({ searchParams }: DevicesPageProps) {
  const { data, isLoading, isPlaceholderData } = useGetAllDevicesQuery({
    searchParams,
    refetchInterval: 5000,
  });
  const [now] = useNow(5000); // re-render every 5s for device status

  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<DeviceResponse>[] = [
    {
      id: "name",
      label: "Name",
      placeholder: "Filter by name",
    },
    {
      id: "emergencyState",
      label: "Emergency State",
      options: [
        {
          label: "Lockdown",
          value: "lockdown",
          icon: Construction,
          iconClassName: "text-destructive",
        },
        {
          label: "Evacuation",
          value: "evacuation",
          icon: BellElectric,
          iconClassName: "text-warning",
        },
      ],
    },
  ];

  const { table } = useDataTable({
    data: data?.data ?? [],
    columns,
    pageCount: data?.pageCount ?? 0,
    filterFields,
    initialState: {
      sorting: [{ id: "createdAt", desc: false }],
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  const emergencyCountAlertOnViewClick = () => {
    table.setColumnFilters([
      {
        id: "emergencyState",
        value: ["lockdown", "evacuation"],
      },
    ]);
  };

  if (isLoading) {
    return <DevicesLoading />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
      <DeviceEmergencyCountAlert onViewClick={emergencyCountAlertOnViewClick} />

      <DataTableToolbar table={table} filterFields={filterFields}>
        <Button size="sm" asChild>
          <Link href="/dashboard/devices/add">
            <PlusCircle className="size-4" />
            Add Device
          </Link>
        </Button>
      </DataTableToolbar>
      <div className="relative flex w-full flex-wrap items-center justify-center gap-12 rounded-lg border bg-muted/60 px-2 py-4">
        {table.getRowModel().rows?.length ? (
          table
            .getRowModel()
            .rows.map((row) => (
              <DeviceCard
                className={cn(isPlaceholderData && "opacity-80")}
                key={row.id}
                device={row.original}
                now={now}
              />
            ))
        ) : (
          <>
            <NoResultsLabel className="top-1/4 translate-y-1/4" />
            {Array.from({ length: 10 }).map((_, index) => (
              <DeviceCardSkeleton key={index} className="opacity-50" />
            ))}
          </>
        )}
      </div>
      <DataTablePagination table={table} enableSelection={false} />
    </div>
  );
}
