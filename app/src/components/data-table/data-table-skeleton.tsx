import { DataTablePaginationSkeleton } from "@/components/data-table/data-table-pagination";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import * as React from "react";

interface DataTableSkeletonProps {
  columnCount: number;
  headersCount: number[];
  rowCount?: number;
  searchableColumnCount?: number;
  filterableColumnCount?: number;
  cellWidths?: string[];
  headersWidths?: string[][];
  actionWidths?: string[];
  showSort?: boolean;
  showViewOptions?: boolean;
  showSelectColumn?: boolean;
  showPagination?: boolean;
  shrinkZero?: boolean;
}

export function DataTableSkeleton(props: DataTableSkeletonProps) {
  const {
    columnCount,
    headersCount,
    rowCount = 10,
    searchableColumnCount = 0,
    filterableColumnCount = 0,
    cellWidths = ["auto"],
    headersWidths = [["auto"]],
    actionWidths = [],
    showSort = true,
    showViewOptions = true,
    showSelectColumn = true,
    showPagination = true,
    shrinkZero = false,
  } = props;

  return (
    <>
      <div className="flex w-full items-center justify-between gap-2 overflow-auto p-1">
        <div className="flex flex-1 items-center gap-2">
          {searchableColumnCount > 0
            ? Array.from({ length: searchableColumnCount }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-40 lg:w-64" />
              ))
            : null}
          {filterableColumnCount > 0
            ? Array.from({ length: filterableColumnCount }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-32 border-dashed" />
              ))
            : null}
          {showSort && <Skeleton className="h-8 w-56" />}
        </div>
        <div className="flex items-center gap-2">
          {actionWidths.map((width, i) => (
            <Skeleton key={i} className="h-8" style={{ width }} />
          ))}
          {showViewOptions && (
            <Skeleton className="ml-auto hidden h-8 w-24 lg:flex" />
          )}
        </div>
      </div>
      <Card className="w-full bg-muted p-0.5">
        <Table>
          <TableHeader className="[&_tr]:border-0">
            {Array.from({ length: headersCount.length }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {showSelectColumn && i === headersCount.length - 1 && (
                  <TableHead className="p-4">
                    <Checkbox disabled={true} />
                  </TableHead>
                )}
                {Array.from({
                  length: headersCount[i]!,
                }).map((_, j) => (
                  <TableHead
                    key={j}
                    className="p-4 py-[0.9rem]"
                    style={{
                      minWidth: shrinkZero ? headersWidths[i]![j] : "auto",
                    }}
                  >
                    <Skeleton
                      className="h-6"
                      style={{
                        width: headersWidths[i]![j],
                        minWidth: shrinkZero ? headersWidths[i]![j] : "auto",
                      }}
                    />
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="before:z-1 relative bg-card before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:border before:border-border">
            {Array.from({ length: rowCount }).map((_, i) => (
              <TableRow key={i} className="p-4">
                {showSelectColumn && (
                  <TableCell className="p-4 py-[1.4rem]">
                    <Checkbox disabled={true} />
                  </TableCell>
                )}
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableCell
                    key={j}
                    style={{
                      minWidth: shrinkZero ? cellWidths[j] : "auto",
                    }}
                    className={cn(
                      "p-4 py-[1.4rem]",
                      i === 0 && "first:rounded-tl-xl last:rounded-tr-xl",
                      i === rowCount - 1 &&
                        "first:rounded-bl-xl last:rounded-br-xl",
                    )}
                  >
                    <Skeleton
                      className="h-6"
                      style={{
                        width: cellWidths[j],
                        minWidth: shrinkZero ? cellWidths[j] : "auto",
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      {showPagination && <DataTablePaginationSkeleton />}
    </>
  );
}
