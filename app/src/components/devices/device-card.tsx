import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { type DeviceResponse } from "@/lib/validations/device";
import {
  BellElectric,
  Construction,
  Lock,
  LockOpen,
  Settings,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

interface DeviceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  device: DeviceResponse;
  index: number;
}

const DeviceCard = React.forwardRef<HTMLDivElement, DeviceCardProps>(
  ({ className, device, index, ...props }, ref) => {
    return (
      <Card className={cn("lg:min-w-[360px]", className)} ref={ref} {...props}>
        <CardHeader className="flex-row items-center gap-2 space-y-0 rounded-t-xl bg-border">
          <CardTitle>{device.name}</CardTitle>
          <Separator
            orientation="vertical"
            className="h-6 bg-card-foreground"
          />
          {index % 2 === 0 ? (
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
            (index % 2 === 0 ? (
              <Button variant="success">
                <LockOpen className="size-4" />
                <span>Unlock</span>
              </Button>
            ) : (
              <Button variant="destructive">
                <Lock className="size-4" />
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
