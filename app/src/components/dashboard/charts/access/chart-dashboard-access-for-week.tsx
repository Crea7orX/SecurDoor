"use client";

import { ChartAccessContainer } from "@/components/dashboard/charts/access/chart-access-container";
import { ChartAccessSkeleton } from "@/components/dashboard/charts/access/chart-access-skeleton";
import { ChartAccessTabsHeader } from "@/components/dashboard/charts/access/chart-access-tabs-header";
import { NoResultsLabel } from "@/components/data-table/no-results-label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig } from "@/components/ui/chart";
import { useGetAccessForWeekChartQuery } from "@/hooks/api/charts/use-get-access-for-week-chart-query";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import * as React from "react";

const chartConfig = {
  unlocks: {
    label: "Dashboard.chart.access.label.unlocks",
    color: "hsl(var(--info))",
  },
  locks: {
    label: "Dashboard.chart.access.label.locks",
    color: "hsl(var(--warning))",
  },
} satisfies ChartConfig;

const ChartDashboardAccessForWeek = React.forwardRef<
  React.ElementRef<typeof Card>,
  React.ComponentProps<typeof Card>
>(({ className, ...props }, ref) => {
  const t = useTranslations("Dashboard.chart.access.dashboard");

  const { data, isLoading } = useGetAccessForWeekChartQuery({
    isDashboard: true,
    refetchInterval: 5000,
  });

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("unlocks");

  return (
    <Card className={cn("w-full", className)} ref={ref} {...props}>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </div>
        <ChartAccessTabsHeader
          chartConfig={chartConfig}
          activeChart={activeChart}
          setActiveChart={setActiveChart}
          data={data ?? []}
          isLoading={isLoading}
        />
      </CardHeader>
      <CardContent className="h-full min-h-64 px-0">
        {isLoading ? (
          <ChartAccessSkeleton />
        ) : !data ? (
          <div className="relative flex h-full items-center justify-center">
            <NoResultsLabel />
            <ChartAccessSkeleton />
          </div>
        ) : (
          <ChartAccessContainer
            config={chartConfig}
            activeChart={activeChart}
            data={data}
          />
        )}
      </CardContent>
    </Card>
  );
});
ChartDashboardAccessForWeek.displayName = "ChartDashboardAccessForWeek";

export { ChartDashboardAccessForWeek };
