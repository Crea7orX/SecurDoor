"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { type ChartEmergencyForWeekResponse } from "@/lib/validations/chart";
import { useFormatter, useTranslations } from "next-intl";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

interface ChartEmergencyContainerProps
  extends Omit<React.ComponentProps<typeof ChartContainer>, "children"> {
  data: ChartEmergencyForWeekResponse[];
}

const ChartEmergencyContainer = React.forwardRef<
  React.ElementRef<typeof ChartContainer>,
  ChartEmergencyContainerProps
>(({ className, data, ...props }, ref) => {
  const t = useTranslations();
  const format = useFormatter();

  return (
    <ChartContainer
      className={cn("aspect-auto h-[250px] w-full pt-4", className)}
      ref={ref}
      {...props}
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
          top: 24,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={24}
          tickFormatter={(value: string) => {
            const date = new Date(value);
            return format.dateTime(date, {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="w-[150px]"
              indicator="dashed"
              nameFormatter={(value) => {
                return t(value);
              }}
              labelFormatter={(value: string) => {
                return format.dateTime(new Date(value), {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }}
            />
          }
        />
        <Bar dataKey="lockdowns" fill={`var(--color-lockdowns)`} radius={8}>
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
        <Bar dataKey="evacuations" fill={`var(--color-evacuations)`} radius={8}>
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
});
ChartEmergencyContainer.displayName = "ChartEmergencyContainer";

export { ChartEmergencyContainer };
