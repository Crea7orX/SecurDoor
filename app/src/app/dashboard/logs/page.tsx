"use client";

import { getColumns } from "@/app/dashboard/logs/_components/logs-table-columns";
import LogsLoading from "@/app/dashboard/logs/loading";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { NoResultsLabel } from "@/components/data-table/no-results-label";
import { LogCard, LogCardSkeleton } from "@/components/logs/log-card";
import { LogDisplayInfos } from "@/config/logs";
import { useGetAllLogsActorsQuery } from "@/hooks/api/logs/use-get-all-logs-actors-query";
import { useGetAllLogsQuery } from "@/hooks/api/logs/use-get-all-logs-query";
import { useDataTable } from "@/hooks/use-data-table";
import { groupLogsByDay } from "@/lib/logs";
import { type LogResponse } from "@/lib/validations/log";
import {
  type DataTableFilterField,
  type SearchParams,
} from "@/types/data-table";
import { MonitorCog } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

interface LogsPageProps {
  searchParams: SearchParams;
}

export default function LogsPage({ searchParams }: LogsPageProps) {
  const _t = useTranslations();
  const t = useTranslations("Log");

  const { data, isLoading } = useGetAllLogsQuery({
    searchParams,
  });
  const { data: actors, isLoading: isLoadingActors } =
    useGetAllLogsActorsQuery();

  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<LogResponse>[] = [
    {
      id: "action",
      label: t("filter.action.label"),
      options: Object.entries(LogDisplayInfos).map(([action, display]) => ({
        label: _t(display.title),
        value: action,
        icon: display.icon,
        iconClassName: `text-${display.color}`,
      })),
    },
    {
      id: "actorId",
      label: t("filter.actor.label"),
      options: [
        {
          label: t("filter.actor.options.system"),
          value: "system",
          icon: MonitorCog,
          iconClassName: "text-info",
        },
        ...(actors
          ?.filter((actor) => actor.actorId !== "system")
          .map((actor) => ({
            label:
              `${actor.actorName ?? ""}${actor.actorEmail ? (actor.actorName ? ` (${actor.actorEmail})` : `${actor.actorEmail}`) : ""}` ||
              actor.actorId,
            value: actor.actorId,
          })) ?? []),
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

  if (isLoading || isLoadingActors) {
    return <LogsLoading />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
      <div className="relative flex w-full flex-col items-center justify-center gap-4">
        <DataTableToolbar table={table} filterFields={filterFields} />
        {table.getRowModel().rows?.length ? (
          <>
            {groupLogsByDay(
              table.getRowModel().rows.map((row) => row.original),
            ).map((group) => (
              <div
                key={group.dateString}
                className="flex w-full flex-col gap-4"
              >
                <div className="sticky top-0 z-10 inline-flex max-w-full items-center gap-2 rounded-md border bg-background px-3 py-1 text-muted-foreground">
                  <div className="h-1 w-full rounded-full bg-border" />
                  <span className="flex-grow">{group.label}</span>
                  <div className="h-1 w-full rounded-full bg-border" />
                </div>

                {group.logs.map((log) => (
                  <LogCard key={log.id} log={log} />
                ))}
              </div>
            ))}
            <DataTablePagination table={table} enableSelection={false} />
          </>
        ) : (
          <>
            <NoResultsLabel className="top-1/4 translate-y-1/4" />
            {Array.from({ length: 10 }).map((_, index) => (
              <LogCardSkeleton key={index} className="w-full opacity-50" />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
