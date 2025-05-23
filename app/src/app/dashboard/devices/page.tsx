"use client";

import { getColumns } from "@/app/dashboard/devices/_components/devices-table-columns";
import DevicesLoading from "@/app/dashboard/devices/loading";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableViewButtons } from "@/components/data-table/data-table-view-buttons";
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
import { useGetEmergencyCountQuery } from "@/hooks/api/emergency/use-get-emergency-count-query";
import { useGetAllTagsQuery } from "@/hooks/api/tags/use-get-all-tags-query";
import { useDataTableViewStore } from "@/hooks/store/use-data-table-view-store";
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
  Lock,
  LockOpen,
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
    refetchInterval: 2500,
  });
  const { data: emergencyCount } = useGetEmergencyCountQuery();
  const { data: tags, isLoading: tagsIsLoading } = useGetAllTagsQuery({
    searchParams: {
      perPage: "50", // todo: maybe pagination
      sort: '[{"id":"name","desc":false},{"id":"createdAt","desc":false}]',
    },
  });

  const { view } = useDataTableViewStore();

  const columns = React.useMemo(() => getColumns({ now }), [now]);

  const filterFields: DataTableFilterField<
    DeviceResponse & DeviceFilterExpand
  >[] = [
    {
      id: "name",
      label: t("filter.name.label"),
      placeholder: t("filter.name.placeholder"),
    },
    {
      id: "isLockedState",
      label: t("filter.state.label"),
      options: [
        {
          label: t("filter.state.options.locked"),
          value: "true",
          icon: Lock,
          iconClassName: "text-destructive",
        },
        {
          label: t("filter.state.options.unlocked"),
          value: "false",
          icon: LockOpen,
          iconClassName: "text-success",
        },
      ],
    },
    {
      id: "emergencyState",
      label: t("filter.emergency_state.label"),
      options: [
        {
          label: t("filter.emergency_state.options.lockdown"),
          value: "lockdown",
          count: emergencyCount?.lockdownCount,
          icon: Construction,
          iconClassName: "text-destructive",
        },
        {
          label: t("filter.emergency_state.options.evacuation"),
          value: "evacuation",
          count: emergencyCount?.evacuationCount,
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
          count: tag.devicesCount,
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
      columnVisibility: {
        isLockedState: false,
        emergencyState: false,
        tagId: false,
      },
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
        <DataTableViewButtons />
        <DeviceBulkControlDialog>
          <Button variant="outline" size="sm">
            <SquareStack />
            {t("bulk.button")}
          </Button>
        </DeviceBulkControlDialog>
        <Button size="sm" asChild>
          <Link href="/dashboard/devices/add">
            <PlusCircle />
            {t("add.header")}
          </Link>
        </Button>
      </DataTableToolbar>
      {view === "grid" ? (
        <div className="relative flex w-full flex-wrap items-center justify-center gap-12 overflow-hidden rounded-xl border bg-muted/60 px-2 py-4">
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
      ) : (
        <DataTable
          className={cn(isPlaceholderData && "opacity-80")}
          table={table}
          columns={columns}
        />
      )}
      <DataTablePagination table={table} enableSelection={false} />
    </div>
  );
}
