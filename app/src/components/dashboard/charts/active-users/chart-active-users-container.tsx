"use client";

import { ChartActiveUsersSkeleton } from "@/components/dashboard/charts/active-users/chart-active-users-skeleton";
import { NoResultsLabel } from "@/components/data-table/no-results-label";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { type ChartActiveUsersForWeekResponse } from "@/lib/validations/chart";
import { Lock, LockOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import type * as RechartsPrimitive from "recharts";
import { Cell, Label, Pie, PieChart } from "recharts";

const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--info))",
  "hsl(var(--warning))",
  "hsl(var(--destructive))",
  "hsl(var(--success))",
  "hsl(var(--primary))",
];

interface ChartActiveUsersContainerProps
  extends Omit<React.ComponentProps<typeof ChartContainer>, "children"> {
  data: ChartActiveUsersForWeekResponse[];
}

const ChartActiveUsersContainer = React.forwardRef<
  React.ElementRef<typeof ChartContainer>,
  ChartActiveUsersContainerProps
>(({ className, data, ...props }, ref) => {
  const t = useTranslations("Dashboard.chart.active_users");

  const totalInteractions = React.useMemo(() => {
    if (!data) return 0;

    return data.reduce((acc, curr) => acc + curr.total, 0);
  }, [data]);

  if (totalInteractions === 0) {
    return (
      <div className="relative flex h-full items-center justify-center">
        <NoResultsLabel />
        <ChartActiveUsersSkeleton />
      </div>
    );
  }

  return (
    <ChartContainer
      className={cn("aspect-square max-h-72 w-full", className)}
      ref={ref}
      {...props}
    >
      <PieChart>
        <ChartTooltip
          content={({
            active,
            payload,
          }: React.ComponentProps<typeof RechartsPrimitive.Tooltip>) => {
            if (!active || !payload?.length) {
              return null;
            }

            const item = payload[0];
            const dataPayload =
              item?.payload as ChartActiveUsersForWeekResponse;

            if (!item || !dataPayload) {
              return null;
            }

            return (
              <div className="grid w-full min-w-[12rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                {item.name}
                <div className="grid gap-1.5">
                  <div
                    key={item.dataKey}
                    className="flex w-full flex-wrap items-center gap-2 [&>*>svg]:size-3.5"
                  >
                    <div className="flex w-full flex-wrap items-center gap-2">
                      <LockOpen className="text-success" />
                      <div className="flex flex-1 items-center justify-between leading-none">
                        <div className="grid gap-1.5">
                          <span className="text-muted-foreground">
                            {t("label.unlocks")}
                          </span>
                        </div>
                        {dataPayload.unlocks && (
                          <span className="font-mono font-medium tabular-nums text-foreground">
                            {dataPayload.unlocks.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex w-full flex-wrap items-center gap-2">
                      <Lock className="text-destructive" />
                      <div className="flex flex-1 items-center justify-between leading-none">
                        <div className="grid gap-1.5">
                          <span className="text-muted-foreground">
                            {t("label.locks")}
                          </span>
                        </div>
                        {dataPayload.locks && (
                          <span className="font-mono font-medium tabular-nums text-foreground">
                            {dataPayload.locks.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                    {t("label.total")}
                    <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                      {dataPayload.total.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
        />
        <Pie data={data} dataKey="total" innerRadius={64} strokeWidth={5}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) - 6}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {totalInteractions.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) + 18}
                      className="fill-muted-foreground"
                    >
                      {t("label.interactions")}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
});
ChartActiveUsersContainer.displayName = "ChartActiveUsersContainer";

export { ChartActiveUsersContainer };
