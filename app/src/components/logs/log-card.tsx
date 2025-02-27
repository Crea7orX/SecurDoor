import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getLogDisplayInfo } from "@/config/logs";
import { cn } from "@/lib/utils";
import { type LogResponse } from "@/lib/validations/log";
import { UserCircle } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import * as React from "react";

export const logColorVariants = {
  default: "border-default text-default ring-default",
  destructive: "border-destructive text-destructive ring-destructive",
  secondary: "border-secondary text-secondary ring-secondary",
  success: "border-success text-success ring-success",
  info: "border-info text-info ring-info",
  warning: "border-warning text-warning ring-warning",
};

interface LogCardProps extends React.HTMLAttributes<HTMLDivElement> {
  log: LogResponse;
}

const LogCard = React.forwardRef<HTMLDivElement, LogCardProps>(
  ({ className, log, ...props }, ref) => {
    const _t = useTranslations();
    const t = useTranslations("Log.card");
    const format = useFormatter();

    const logDisplayInfo = getLogDisplayInfo(log.action);

    return (
      <Card className={cn("relative", className)} ref={ref} {...props}>
        <Badge
          variant="outline"
          className={cn(
            "absolute -left-3 -top-3 w-fit bg-card p-1.5 ring-2",
            `${logColorVariants[logDisplayInfo.color]}`,
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
              {_t(logDisplayInfo.text, {
                actor:
                  log.actorId === "system"
                    ? t("actor.system")
                    : `${log.actorName ?? ""}${log.actorEmail ? (log.actorName ? ` (${log.actorEmail})` : `${log.actorEmail}`) : ""}`,
              })}
            </h2>
            <span className="text-muted-foreground">
              {format.dateTime(log.createdAt * 1000, {
                dateStyle: "medium",
                timeStyle: "medium",
              })}
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
>(({ className, children, ...props }, ref) => {
  return (
    <Card className={cn("relative", className)} ref={ref} {...props}>
      <div className="absolute -left-3 -top-3 size-8 bg-card">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="flex items-center gap-4 p-4">
        <Skeleton className="size-8" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-6 w-full max-w-96" />
          <Skeleton className="h-4 w-full max-w-48" />
        </div>
      </div>
      {children}
    </Card>
  );
});
LogCardSkeleton.displayName = "LogCardSkeleton";

export { LogCard, LogCardSkeleton };
