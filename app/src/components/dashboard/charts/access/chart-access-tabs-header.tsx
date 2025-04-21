"use client";

import { type ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { type ChartAccessForWeekResponse } from "@/lib/validations/chart";
import { useTranslations } from "next-intl";
import * as React from "react";
import { type Dispatch, type SetStateAction } from "react";

interface ChartAccessTabsHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  chartConfig: ChartConfig;
  activeChart: string;
  setActiveChart: Dispatch<SetStateAction<"unlocks" | "locks">>;
  data: ChartAccessForWeekResponse[];
  isLoading: boolean;
}
const ChartAccessTabsHeader = React.forwardRef<
  HTMLDivElement,
  ChartAccessTabsHeaderProps
>(
  (
    {
      className,
      chartConfig,
      activeChart,
      setActiveChart,
      data,
      isLoading,
      ...props
    },
    ref,
  ) => {
    const t = useTranslations();

    const total = React.useMemo(() => {
      if (!data)
        return {
          unlocks: 0,
          locks: 0,
        };

      return {
        unlocks: data.reduce((acc, curr) => acc + curr.unlocks, 0),
        locks: data.reduce((acc, curr) => acc + curr.locks, 0),
      };
    }, [data]);

    return (
      <div className={cn("flex flex-1", className)} ref={ref} {...props}>
        {Object.entries(chartConfig).map(([key]) => {
          return (
            <button
              key={key}
              data-active={activeChart === key}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => setActiveChart(key as "unlocks" | "locks")}
            >
              <span className="text-xs text-muted-foreground">
                {t(chartConfig[key]?.label)}
              </span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {isLoading ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  total[key as keyof typeof total]
                )}
              </span>
            </button>
          );
        })}
      </div>
    );
  },
);
ChartAccessTabsHeader.displayName = "ChartAccessTabsHeader";

export { ChartAccessTabsHeader };
