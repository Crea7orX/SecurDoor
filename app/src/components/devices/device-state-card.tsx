import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type DeviceResponse } from "@/lib/validations/device";
import { BellElectric, Construction, Hand, Lock, LockOpen } from "lucide-react";
import * as React from "react";

interface DeviceStateCardProps extends React.HTMLAttributes<HTMLDivElement> {
  device: DeviceResponse;
}

const DeviceStateCard = React.forwardRef<HTMLDivElement, DeviceStateCardProps>(
  ({ className, device, ...props }, ref) => {
    return (
      <Card className={className} ref={ref} {...props}>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-1">
            <Hand className="size-6" />
            <span>State</span>
          </CardTitle>
          <CardDescription>State of the door lock</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          {!device.state ? (
            <Skeleton className="h-8 w-32" />
          ) : device.state.isLockedState ? (
            <Badge variant="destructive" className="text-md">
              <Lock className="mr-1 size-4" />
              <span>Locked</span>
            </Badge>
          ) : (
            <Badge variant="success" className="text-md">
              <LockOpen className="mr-1 size-4" />
              <span>Unlocked</span>
            </Badge>
          )}
          {device.emergencyState === "lockdown" ? (
            <Badge
              variant="destructive"
              className="text-md ring-4 ring-destructive/50"
            >
              <Construction className="mr-1 size-4" />
              <span>LOCKDOWN</span>
            </Badge>
          ) : (
            device.emergencyState === "evacuation" && (
              <Badge
                variant="warning"
                className="text-md ring-4 ring-warning/50"
              >
                <BellElectric className="mr-1 size-4" />
                <span>EVACUATION</span>
              </Badge>
            )
          )}
        </CardContent>
      </Card>
    );
  },
);
DeviceStateCard.displayName = "DeviceStateCard";

export { DeviceStateCard };
