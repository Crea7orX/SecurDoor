import { LogCardSkeleton } from "@/components/logs/log-card";
import { Skeleton } from "@/components/ui/skeleton";
import * as React from "react";

export default function LogsLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
      <div className="flex w-full flex-col justify-center gap-4">
        <div className="flex w-full items-center justify-between gap-2 overflow-auto p-1">
          <div className="flex flex-1 items-center gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>

        <div className="inline-flex max-w-full items-center gap-2 rounded-md border bg-background px-3 py-1">
          <div className="h-1 w-full rounded-full bg-border" />
          <span className="flex-grow">
            <Skeleton className="h-6 w-24" />
          </span>
          <div className="h-1 w-full rounded-full bg-border" />
        </div>

        {Array.from({ length: 10 }).map((_, index) => (
          <LogCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
