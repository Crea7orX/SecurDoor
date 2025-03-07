import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import * as React from "react";

export function ChartActiveUsersSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton
      className={cn("flex size-full min-h-72 items-end gap-4 p-4", className)}
      {...props}
    />
  );
}
