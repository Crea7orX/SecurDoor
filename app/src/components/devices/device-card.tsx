import { DeviceLockButton } from "@/components/devices/access/device-lock-button";
import { DeviceStateBadges } from "@/components/devices/access/device-state-badges";
import { DeviceStatusDot } from "@/components/devices/access/device-status-dot";
import { DeviceUnlockButton } from "@/components/devices/access/device-unlock-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { type DeviceResponse } from "@/lib/validations/device";
import { Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import * as React from "react";

interface DeviceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  device: DeviceResponse;
  now: Date;
}

const DeviceCard = React.forwardRef<HTMLDivElement, DeviceCardProps>(
  ({ className, device, now, ...props }, ref) => {
    const tButton = useTranslations("Common.button");

    return (
      <Card
        className={cn(
          "relative w-full max-w-[360px] bg-border md:min-w-[360px]",
          className,
        )}
        ref={ref}
        {...props}
      >
        <DeviceStatusDot
          className="absolute -left-2 -top-2"
          status={device.state?.status ?? "unknown"}
          lastSeenAt={device.state?.lastSeenAt ?? 0}
          now={now}
        />
        <CardHeader className="items-center gap-2 space-y-0 md:flex-row">
          <CardTitle className="w-full max-w-fit truncate">
            {device.name}
          </CardTitle>
          <Separator
            orientation="vertical"
            className="h-6 bg-card-foreground max-md:hidden"
          />
          <div className="flex flex-wrap items-center gap-2 max-md:justify-center">
            {!device.state ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <DeviceStateBadges
                isLockedState={device.state.isLockedState}
                emergencyState={device.emergencyState}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 rounded-xl bg-card pt-6">
          <Button className="flex-1" asChild>
            <Link href={`/dashboard/devices/${device.id}`}>
              <Settings className="size-4" />
              {tButton("settings")}
            </Link>
          </Button>
          {!device.emergencyState &&
            (!device.state ? (
              <Skeleton className="h-9 w-24" />
            ) : device.state.isLockedState ? (
              <DeviceUnlockButton className="flex-1" device={device} />
            ) : (
              <DeviceLockButton className="flex-1" device={device} />
            ))}
        </CardContent>
      </Card>
    );
  },
);
DeviceCard.displayName = "DeviceCard";

const DeviceCardSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <Card
      className={cn(
        "relative w-full max-w-[360px] bg-border md:min-w-[360px]",
        className,
      )}
      ref={ref}
      {...props}
    >
      <div className="absolute -left-2 -top-2 size-4 rounded-full bg-border ring-4 ring-border/50" />
      <CardHeader className="items-center gap-2 space-y-0 overflow-hidden md:flex-row">
        <Skeleton className="h-6 w-full max-w-48" />
        <Separator
          orientation="vertical"
          className="h-6 bg-card-foreground max-md:hidden"
        />
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 rounded-xl bg-card pt-6">
        <Skeleton className="h-9 min-w-40 flex-1" />
        <Skeleton className="h-9 min-w-32 flex-1" />
      </CardContent>
    </Card>
  );
});
DeviceCardSkeleton.displayName = "DeviceCard";

export { DeviceCard, DeviceCardSkeleton };
