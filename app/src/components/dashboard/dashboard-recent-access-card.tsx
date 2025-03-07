"use client";

import { NoResultsLabel } from "@/components/data-table/no-results-label";
import {
  LogActivityCard,
  LogActivityCardSkeleton,
} from "@/components/logs/log-activity-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetAllLogsQuery } from "@/hooks/api/logs/use-get-all-logs-query";
import { cn } from "@/lib/utils";
import { type SearchParams } from "@/types/data-table";
import { Eye, ScrollText } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import * as React from "react";

const DashboardRecentAccessCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const t = useTranslations("Log.recent_access");
  const format = useFormatter();

  const searchParams: SearchParams = React.useMemo(
    () => ({
      perPage: "10",
      action: "device.unlock,device.lock,device.access_denied",
    }),
    [],
  );

  const { data, isLoading, dataUpdatedAt } = useGetAllLogsQuery({
    searchParams,
    refetchInterval: 2500,
  });

  return (
    <Card className={cn("h-full bg-border", className)} ref={ref} {...props}>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-2 font-bold">
          <ScrollText className="size-6" />
          <div className="flex flex-col gap-1">
            <span>{t("title")}</span>
            {dataUpdatedAt > 0 && (
              <span className="text-muted-foreground">
                {t("last_updated", {
                  date: format.dateTime(dataUpdatedAt, {
                    timeStyle: "medium",
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                  }),
                })}
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative flex h-full flex-col gap-6 px-2">
        {data && data.data.length > 0 ? (
          data.data.map((log) => <LogActivityCard key={log.id} log={log} />)
        ) : (
          <>
            {!isLoading && (
              <NoResultsLabel className="left-1/2 top-1/4 -translate-x-1/2 translate-y-1/4" />
            )}
            {Array.from({ length: 3 }).map((_, index) => (
              <LogActivityCardSkeleton
                className={cn(!isLoading && "opacity-50")}
                key={index}
              />
            ))}
          </>
        )}
      </CardContent>
      <CardFooter className="justify-end p-4">
        <Button variant="info" className="max-md:w-full" asChild>
          <Link href="/dashboard/logs">
            <Eye />
            <span>{t("view_all")}</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
});
DashboardRecentAccessCard.displayName = "DashboardRecentAccessCard";

export { DashboardRecentAccessCard };
