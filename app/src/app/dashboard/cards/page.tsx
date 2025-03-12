"use client";

import { getColumns } from "@/app/dashboard/cards/_components/cards-table-columns";
import CardsLoading from "@/app/dashboard/cards/loading";
import { CardCard, CardCardSkeleton } from "@/components/cards/card-card";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { NoResultsLabel } from "@/components/data-table/no-results-label";
import { DemoAlert } from "@/components/demo/demo-alert";
import { Button } from "@/components/ui/button";
import { useGetAllCardsQuery } from "@/hooks/api/cards/use-get-all-cards-query";
import { useDataTable } from "@/hooks/use-data-table";
import { cn } from "@/lib/utils";
import { type CardResponse } from "@/lib/validations/card";
import type { DataTableFilterField, SearchParams } from "@/types/data-table";
import { OctagonMinus, PlusCircle, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import * as React from "react";

interface CardsPageProps {
  searchParams: SearchParams;
}

export default function CardsPage({ searchParams }: CardsPageProps) {
  const t = useTranslations("Card");

  const { data, isLoading, isPlaceholderData } = useGetAllCardsQuery({
    searchParams,
  });

  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<CardResponse>[] = [
    {
      id: "holder",
      label: t("filter.holder.label"),
      placeholder: t("filter.holder.placeholder"),
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
      sorting: [{ id: "createdAt", desc: false }],
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  if (isLoading) {
    return <CardsLoading />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-1 sm:p-4">
      <DemoAlert />

      <DataTableToolbar table={table} filterFields={filterFields}>
        <Button size="sm" asChild>
          <Link href="/dashboard/cards/add">
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
              <CardCard
                className={cn(isPlaceholderData && "opacity-80")}
                key={row.id}
                card={row.original}
              />
            ))
        ) : (
          <>
            <NoResultsLabel className="top-1/4 translate-y-1/4" />
            {Array.from({ length: 10 }).map((_, index) => (
              <CardCardSkeleton key={index} className="opacity-50" />
            ))}
          </>
        )}
      </div>
      <DataTablePagination table={table} enableSelection={false} />
    </div>
  );
}
