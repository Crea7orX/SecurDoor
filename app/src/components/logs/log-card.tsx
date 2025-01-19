import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getLogDisplayInfo } from "@/config/logs";
import { cn } from "@/lib/utils";
import { LogResponse } from "@/lib/validations/log";
import { UserCircle } from "lucide-react";
import * as React from "react";

interface LogCardProps extends React.HTMLAttributes<HTMLDivElement> {
  log: LogResponse;
}

const LogCard = React.forwardRef<HTMLDivElement, LogCardProps>(
  ({ className, log, ...props }, ref) => {
    const logDisplayInfo = getLogDisplayInfo(log.action);

    return (
      <Card className={cn("relative", className)} ref={ref} {...props}>
        <Badge
          variant="outline"
          className={cn(
            "absolute -left-3 -top-3 w-fit border-2 bg-card p-1.5 ring-2",
            `border-${logDisplayInfo.color} text-[hsl(var(--${logDisplayInfo.color}))] ring-[hsl(var(--${logDisplayInfo.color}))]`,
          )}
        >
          <logDisplayInfo.icon
            className={cn("size-4", `fill-${logDisplayInfo.color}`)}
          />
        </Badge>
        <div className="{/*pb-2*/} flex items-center gap-4 p-4">
          <UserCircle className="size-8" />
          <div className="flex-1">
            <h2 className="font-semibold">
              {logDisplayInfo.text.replace("{actor}", log.actor)}
            </h2>
            <span className="text-muted-foreground">
              {new Date(log.createdAt * 1000).toLocaleString()}
            </span>
          </div>
        </div>
        {/*<CardContent className="p-4 pt-0"></CardContent>*/}
      </Card>
    );
  },
);
LogCard.displayName = "LogCard";

const LogCardSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <Card className={cn("relative", className)} ref={ref} {...props}>
      <div className="absolute -left-3 -top-3 size-8 bg-card">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="flex items-center gap-4 p-4">
        <Skeleton className="size-8" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-6 w-96" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </Card>
  );
});
LogCardSkeleton.displayName = "LogCardSkeleton";

export { LogCard, LogCardSkeleton };
