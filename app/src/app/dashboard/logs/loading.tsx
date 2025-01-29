import { LogCardSkeleton } from "@/components/logs/log-card";
import { Skeleton } from "@/components/ui/skeleton";

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
        {Array.from({ length: 10 }).map((_, index) => (
          <LogCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
