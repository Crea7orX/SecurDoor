"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { type DeviceResponse } from "@/lib/validations/device";
import { type DeviceStateResponse } from "@/lib/validations/device-state";
import {
  BellElectric,
  Construction,
  Lock,
  LockOpen,
  Settings,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

export const statusColorVariants = {
  pendingAdoption: "bg-warning ring-warning/50",
  adopting: "bg-info ring-info/50",
  online: "bg-success ring-success/50",
  offline: "bg-destructive ring-destructive/50",
};

function getStatusColor(deviceState: DeviceStateResponse, now: Date) {
  if (deviceState.status === "pending_adoption")
    return statusColorVariants.pendingAdoption;

  if (deviceState.status === "adopting") return statusColorVariants.adopting;

  if (now.getTime() - (deviceState.lastSeenAt ?? 0) * 1000 < 15000)
    return statusColorVariants.online;

  return statusColorVariants.offline;
}

interface DeviceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  device: DeviceResponse;
  now: Date;
}

const DeviceCard = React.forwardRef<HTMLDivElement, DeviceCardProps>(
  ({ className, device, now, ...props }, ref) => {
    return (
      <Card
        className={cn("relative lg:min-w-[360px]", className)}
        ref={ref}
        {...props}
      >
        <div
          className={cn(
            "absolute -left-2 -top-2 size-4 rounded-full bg-success ring-4 ring-success/50",
            getStatusColor(device.state!, now),
          )}
        />
        <CardHeader className="flex-row items-center gap-2 space-y-0 rounded-t-xl bg-border">
          <CardTitle>{device.name}</CardTitle>
          <Separator
            orientation="vertical"
            className="h-6 bg-card-foreground"
          />
          {!device.state ? (
            <Skeleton className="h-6 w-24" />
          ) : device.state.isLockedState ? (
            <Badge variant="destructive">
              <Lock className="mr-1 size-4" />
              <span>LOCKED</span>
            </Badge>
          ) : (
            <Badge variant="success">
              <LockOpen className="mr-1 size-4" />
              <span>UNLOCKED</span>
            </Badge>
          )}
          {device.emergencyState === "lockdown" ? (
            <Badge variant="destructive" className="ring-4 ring-destructive/50">
              <Construction className="mr-1 size-4" />
              <span>LOCKDOWN</span>
            </Badge>
          ) : (
            device.emergencyState === "evacuation" && (
              <Badge variant="warning" className="ring-4 ring-warning/50">
                <BellElectric className="mr-1 size-4" />
                <span>EVACUATION</span>
              </Badge>
            )
          )}
        </CardHeader>
        <CardContent className="flex gap-2 pt-2">
          <Button className="flex-1" asChild>
            <Link href={`/dashboard/devices/${device.id}`}>
              <Settings className="size-4" />
              Settings
            </Link>
          </Button>
          {!device.emergencyState &&
            (!device.state ? (
              <Skeleton className="h-9 w-24" />
            ) : device.state.isLockedState ? (
              <Button variant="success">
                <LockOpen />
                <span>Unlock</span>
              </Button>
            ) : (
              <Button variant="destructive">
                <Lock />
                <span>Lock</span>
              </Button>
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
    <Card className={cn("lg:min-w-[360px]", className)} ref={ref} {...props}>
      <CardHeader className="flex-row items-center gap-2 space-y-0 rounded-t-xl bg-border">
        <Skeleton className="h-6 w-32" />
        <Separator orientation="vertical" className="h-6 bg-card-foreground" />
        <Skeleton className="h-6 w-24" />
      </CardHeader>
      <CardContent className="flex gap-2 pt-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-24" />
      </CardContent>
    </Card>
  );
});
DeviceCardSkeleton.displayName = "DeviceCard";

export { DeviceCard, DeviceCardSkeleton };
