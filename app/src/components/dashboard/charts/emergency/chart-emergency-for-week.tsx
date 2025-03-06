"use client";

import { ChartEmergencyContainer } from "@/components/dashboard/charts/emergency/chart-emergency-container";
import { ChartEmergencySkeleton } from "@/components/dashboard/charts/emergency/chart-emergency-skeleton";
import { NoResultsLabel } from "@/components/data-table/no-results-label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig } from "@/components/ui/chart";
import { useGetEmergencyForWeekChartQuery } from "@/hooks/api/charts/use-get-emergency-for-week-chart-query";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import * as React from "react";

const chartConfig = {
  lockdowns: {
    label: "Dashboard.chart.emergency.label.lockdowns",
    color: "hsl(var(--destructive))",
  },
  evacuations: {
    label: "Dashboard.chart.emergency.label.evacuations",
    color: "hsl(var(--warning))",
  },
} satisfies ChartConfig;

const ChartEmergencyForWeek = React.forwardRef<
  React.ElementRef<typeof Card>,
  React.ComponentProps<typeof Card>
>(({ className, ...props }, ref) => {
  const t = useTranslations("Dashboard.chart.emergency");

  const { data, isLoading } = useGetEmergencyForWeekChartQuery({
    refetchInterval: 5000,
  });

  return (
    <Card className={cn("w-full", className)} ref={ref} {...props}>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6 sm:text-center">
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="h-full min-h-64 px-0">
        {isLoading ? (
          <ChartEmergencySkeleton />
        ) : !data ? (
          <div className="relative flex h-full items-center justify-center">
            <NoResultsLabel />
            <ChartEmergencySkeleton />
          </div>
        ) : (
          <ChartEmergencyContainer config={chartConfig} data={data} />
        )}
      </CardContent>
    </Card>
  );
});
ChartEmergencyForWeek.displayName = "ChartEmergencyForWeek";

export { ChartEmergencyForWeek };
