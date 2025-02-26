import { logColorVariants } from "@/components/logs/log-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getLogDisplayInfo } from "@/config/logs";
import { cn } from "@/lib/utils";
import { type LogResponse } from "@/lib/validations/log";
import { useTranslations } from "next-intl";
import * as React from "react";

interface LogActivityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  log: LogResponse;
}

const LogActivityCard = React.forwardRef<HTMLDivElement, LogActivityCardProps>(
  ({ className, log, ...props }, ref) => {
    const _t = useTranslations();
    const t = useTranslations("Log.activity_card");

    const logDisplayInfo = getLogDisplayInfo(log.action);

    return (
      <Card className={cn("relative", className)} ref={ref} {...props}>
        <Badge
          variant="outline"
          className={cn(
            "absolute -left-1 -top-3 w-fit bg-card p-1.5 ring-2",
            `${logColorVariants[logDisplayInfo.color]}`,
          )}
        >
          <logDisplayInfo.icon
            className={cn("mr-1 size-4", `fill-${logDisplayInfo.color}`)}
          />
          <span>{_t(logDisplayInfo.title)}</span>
        </Badge>
        <CardContent className="p-4 pt-6">
          <p>
            {t.rich("by.text", {
              actor:
                log.actorId === "system"
                  ? t("by.system")
                  : `${log.actorName ?? log.actorEmail ?? t("by.unknown")}`,
              semibold: (chunks) => (
                <span className="font-semibold">{chunks}</span>
              ),
            })}
          </p>
          <p className="text-muted-foreground">
            {t.rich("on", {
              date: new Date(log.createdAt * 1000).toLocaleString(),
              semibold: (chunks) => (
                <span className="font-semibold">{chunks}</span>
              ),
            })}
          </p>
        </CardContent>
      </Card>
    );
  },
);
LogActivityCard.displayName = "LogActivityCard";

const LogActivityCardSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <Card className={cn("relative", className)} ref={ref} {...props}>
      <div className="absolute -left-1 -top-3 h-8 w-28 rounded-md bg-card ring-2 ring-card">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="flex flex-col gap-2 p-4 pt-8">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-48" />
      </CardContent>
    </Card>
  );
});
LogActivityCardSkeleton.displayName = "LogActivityCardSkeleton";

export { LogActivityCard, LogActivityCardSkeleton };
