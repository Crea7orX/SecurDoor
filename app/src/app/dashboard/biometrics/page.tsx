"use client";

import BiometricsLoading from "@/app/dashboard/biometrics/loading";
import { BiometricAddDialog } from "@/components/biometrics/biometric-add-dialog";
import {
  BiometricCard,
  BiometricCardSkeleton,
} from "@/components/biometrics/biometric-card";
import { getColumns } from "@/components/biometrics/data-table/biometrics-table-columns";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableViewButtons } from "@/components/data-table/data-table-view-buttons";
import { NoResultsLabel } from "@/components/data-table/no-results-label";
import { DemoAlert } from "@/components/demo/demo-alert";
import { Button } from "@/components/ui/button";
import { useGetAllBiometricsQuery } from "@/hooks/api/biometrics/use-get-all-biometrics-query";
import { useDataTableViewStore } from "@/hooks/store/use-data-table-view-store";
import { useDataTable } from "@/hooks/use-data-table";
import { cn } from "@/lib/utils";
import type { BiometricResponse } from "@/lib/validations/biometric";
import type { DataTableFilterField, SearchParams } from "@/types/data-table";
import { OctagonMinus, PlusCircle, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

interface BiometricsPageProps {
  searchParams: SearchParams;
}

export default function BiometricsPage({ searchParams }: BiometricsPageProps) {
  const t = useTranslations("Biometric");

  const { data, isLoading, isPlaceholderData } = useGetAllBiometricsQuery({
    searchParams,
  });

  const { view } = useDataTableViewStore();

  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<BiometricResponse>[] = [
    {
      id: "individual",
      label: t("filter.individual.label"),
      placeholder: t("filter.individual.placeholder"),
    },
    {
      id: "active",
      label: t("filter.active.label"),
      options: [
        {
          label: t("filter.active.options.active"),
          value: "true",
          icon: ShieldCheck,
          iconClassName: "text-success",
        },
        {
          label: t("filter.active.options.disabled"),
          value: "false",
          icon: OctagonMinus,
          iconClassName: "text-destructive",
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
      sorting: [{ id: "createdAt", desc: true }],
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  if (isLoading) {
    return <BiometricsLoading />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-1 sm:p-4">
      <DemoAlert />

      <DataTableToolbar table={table} filterFields={filterFields}>
        <DataTableViewButtons />
        <BiometricAddDialog>
          <Button size="sm">
            <PlusCircle className="size-4" />
            {t("add.title")}
          </Button>
        </BiometricAddDialog>
      </DataTableToolbar>
      {view === "grid" ? (
        <div className="relative flex w-full flex-wrap items-center justify-center gap-12 overflow-hidden rounded-xl border bg-muted/60 px-2 py-4">
          {table.getRowModel().rows?.length ? (
            table
              .getRowModel()
              .rows.map((row) => (
                <BiometricCard
                  className={cn(isPlaceholderData && "opacity-80")}
                  key={row.id}
                  biometric={row.original}
                />
              ))
          ) : (
            <>
              <NoResultsLabel className="top-1/4 translate-y-1/4" />
              {Array.from({ length: 10 }).map((_, index) => (
                <BiometricCardSkeleton key={index} className="opacity-50" />
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
