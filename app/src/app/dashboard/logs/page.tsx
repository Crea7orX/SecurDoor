"use client";

import { getColumns } from "@/app/dashboard/logs/_components/logs-table-columns";
import LogsLoading from "@/app/dashboard/logs/loading";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { LogCard, LogCardSkeleton } from "@/components/logs/log-card";
import { LogDisplayInfos } from "@/config/logs";
import { useGetAllLogsActorsQuery } from "@/hooks/api/logs/use-get-all-logs-actors-query";
import { useGetAllLogsQuery } from "@/hooks/api/logs/use-get-all-logs-query";
import { useDataTable } from "@/hooks/use-data-table";
import { type LogResponse } from "@/lib/validations/log";
import {
  type DataTableFilterField,
  type SearchParams,
} from "@/types/data-table";
import * as React from "react";

interface LogsPageProps {
  searchParams: SearchParams;
}

export default function LogsPage({ searchParams }: LogsPageProps) {
  const { data, isLoading } = useGetAllLogsQuery({
    searchParams,
  });
  const { data: actors, isLoading: isLoadingActors } =
    useGetAllLogsActorsQuery();

  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<LogResponse>[] = [
    {
      id: "action",
      label: "Action",
      options: Object.entries(LogDisplayInfos).map(([action, display]) => ({
        label: display.title,
        value: action,
        icon: display.icon,
        iconClassName: `text-${display.color}`,
      })),
    },
    {
      id: "actorId",
      label: "Actor",
      options: actors?.map((actor) => ({
        label:
          `${actor.actorName ?? ""}${actor.actorEmail ? (actor.actorName ? ` (${actor.actorEmail})` : `${actor.actorEmail}`) : ""}` ||
          actor.actorId,
        value: actor.actorId,
      })),
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
      <div className="relative flex w-full flex-col justify-center gap-4">
        <DataTableToolbar table={table} filterFields={filterFields} />
        {table.getRowModel().rows?.length ? (
          <>
            {table.getRowModel().rows.map((row) => (
              <LogCard key={row.id} log={row.original} />
            ))}
            <DataTablePagination table={table} enableSelection={false} />
          </>
        ) : (
          <>
            {Array.from({ length: 10 }).map((_, index) => (
              <>
                <LogCardSkeleton key={index} className="opacity-50">
                  {index === 1 && (
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
                      No results.
                    </span>
                  )}
                </LogCardSkeleton>
              </>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
