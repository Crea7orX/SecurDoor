"use client";

import { ChartActiveUsersContainer } from "@/components/dashboard/charts/active-users/chart-active-users-container";
import { ChartActiveUsersSkeleton } from "@/components/dashboard/charts/active-users/chart-active-users-skeleton";
import { NoResultsLabel } from "@/components/data-table/no-results-label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetActiveUsersForWeekChartQuery } from "@/hooks/api/charts/use-get-active-users-for-week-chart-query";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import * as React from "react";

const ChartActiveUsersForWeek = React.forwardRef<
  React.ElementRef<typeof Card>,
  React.ComponentProps<typeof Card>
>(({ className, ...props }, ref) => {
  const t = useTranslations("Dashboard.chart.active_users.card");

  const { data, isLoading } = useGetActiveUsersForWeekChartQuery({
    refetchInterval: 5000,
  });

  return (
    <Card className={cn("flex w-full", className)} ref={ref} {...props}>
      <CardHeader className="items-center pb-0">
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pt-4">
        {isLoading ? (
          <ChartActiveUsersSkeleton />
        ) : !data ? (
          <div className="relative flex h-full items-center justify-center">
            <NoResultsLabel />
            <ChartActiveUsersSkeleton />
          </div>
        ) : (
          <ChartActiveUsersContainer config={{}} data={data} />
        )}
      </CardContent>
    </Card>
  );
});
ChartActiveUsersForWeek.displayName = "ChartActiveUsersForWeek";

export { ChartActiveUsersForWeek };
