"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import * as React from "react";

const ChartAccessSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  // 7 random heights between 20 to 90%.
  const heights = React.useMemo(() => {
    return Array.from({ length: 7 }).map(
      () => `${Math.floor(Math.random() * 70) + 20}%`,
    );
  }, []);

  return (
    <div
      className={cn("flex size-full items-end gap-4 p-4", className)}
      ref={ref}
      {...props}
    >
      {heights.map((height, index) => (
        <Skeleton
          className={cn("h-[--skeleton-height] w-full")}
          key={index}
          style={
            {
              "--skeleton-height": height,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
});
ChartAccessSkeleton.displayName = "ChartAccessSkeleton";

export { ChartAccessSkeleton };
