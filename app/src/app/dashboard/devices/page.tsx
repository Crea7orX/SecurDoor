"use client";

import { getColumns } from "@/app/dashboard/devices/_components/devices-table-columns";
import DevicesLoading from "@/app/dashboard/devices/loading";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { NoResultsLabel } from "@/components/data-table/no-results-label";
import { DemoAlert } from "@/components/demo/demo-alert";
import { DeviceBulkControlDialog } from "@/components/devices/bulk/device-bulk-control-dialog";
import {
  DeviceCard,
  DeviceCardSkeleton,
} from "@/components/devices/device-card";
import { DeviceEmergencyCountAlert } from "@/components/devices/device-emergency-count-alert";
import { Button } from "@/components/ui/button";
import { useGetAllDevicesQuery } from "@/hooks/api/devices/use-get-all-devices-query";
import { useGetAllTagsQuery } from "@/hooks/api/tags/use-get-all-tags-query";
import { useDataTable } from "@/hooks/use-data-table";
import { cn } from "@/lib/utils";
import {
  type DeviceFilterExpand,
  type DeviceResponse,
} from "@/lib/validations/device";
import type { DataTableFilterField, SearchParams } from "@/types/data-table";
import {
  BellElectric,
  Construction,
  PlusCircle,
  SquareStack,
} from "lucide-react";
import { useNow, useTranslations } from "next-intl";
import Link from "next/link";
import * as React from "react";

interface DevicesPageProps {
  searchParams: SearchParams;
}

export default function DevicesPage({ searchParams }: DevicesPageProps) {
  const t = useTranslations("Device");
  const now = useNow({
    updateInterval: 1000,
  }); // re-render every 1s for device status

  const { data, isLoading, isPlaceholderData } = useGetAllDevicesQuery({
    searchParams,
    refetchInterval: 5000,
  });
  const { data: tags, isLoading: tagsIsLoading } = useGetAllTagsQuery({
    searchParams: {
      perPage: "50", // todo: maybe pagination
      sort: '[{"id":"name","desc":false},{"id":"createdAt","desc":false}]',
    },
  });

  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<
    DeviceResponse & DeviceFilterExpand
  >[] = [
    {
      id: "name",
      label: t("filter.name.label"),
      placeholder: t("filter.name.placeholder"),
    },
    {
      id: "emergencyState",
      label: t("filter.emergency_state.label"),
      options: [
        {
          label: t("filter.emergency_state.options.lockdown"),
          value: "lockdown",
          icon: Construction,
          iconClassName: "text-destructive",
        },
        {
          label: t("filter.emergency_state.options.evacuation"),
          value: "evacuation",
          icon: BellElectric,
          iconClassName: "text-warning",
        },
      ],
    },
    {
      id: "tagId",
      label: t("filter.tag.label"),
      options:
        tags?.data.map((tag) => ({
          label: tag.name,
          value: tag.id,
        })) ?? [],
    },
  ];

  const { table } = useDataTable({
    data: data?.data ?? [],
    columns,
    pageCount: data?.pageCount ?? 0,
    filterFields,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
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

  if (isLoading || tagsIsLoading) {
    return <DevicesLoading />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-1 sm:p-4">
      <DemoAlert />
      <DeviceEmergencyCountAlert onViewClick={emergencyCountAlertOnViewClick} />

      <DataTableToolbar table={table} filterFields={filterFields}>
        <DeviceBulkControlDialog>
          <Button variant="outline" size="sm">
            <SquareStack className="size-4" />
            {t("bulk.button")}
          </Button>
        </DeviceBulkControlDialog>
        <Button size="sm" asChild>
          <Link href="/dashboard/devices/add">
            <PlusCircle className="size-4" />
            {t("add.header")}
          </Link>
        </Button>
      </DataTableToolbar>
      <div className="relative flex w-full flex-wrap items-center justify-center gap-12 overflow-hidden rounded-lg border bg-muted/60 px-2 py-4">
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
