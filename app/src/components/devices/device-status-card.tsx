"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDeviceStatusDisplayInfo } from "@/config/device-statuses";
import { useGetDeviceByIdStateQuery } from "@/hooks/api/devices-states/use-get-device-by-id-state-query";
import { cn } from "@/lib/utils";
import { CircleDotDashed, EthernetPort } from "lucide-react";
import * as React from "react";

interface DeviceStatusCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

const DeviceStatusCard = React.forwardRef<
  HTMLDivElement,
  DeviceStatusCardProps
>(({ className, id, ...props }, ref) => {
  const { data } = useGetDeviceByIdStateQuery({ id });

  const deviceStatusDisplayInfo = getDeviceStatusDisplayInfo(
    data?.status ?? "",
  );

  return (
    <Card className={className} ref={ref} {...props}>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-1">
          <EthernetPort className="size-6" />
          <span>Status</span>
        </CardTitle>
        <CardDescription>Device online status</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <Badge variant="destructive" className="text-md">
            <CircleDotDashed className="mr-1 size-4" />
            <span>Offline</span>
          </Badge>
          {data?.status && data?.status !== "adopted" && (
            <Badge variant={deviceStatusDisplayInfo.color} className="text-md">
              <deviceStatusDisplayInfo.icon
                className={cn(
                  "mr-1 size-4",
                  `fill-${deviceStatusDisplayInfo.color}`,
                )}
              />
              <span>{deviceStatusDisplayInfo.text}</span>
            </Badge>
          )}
        </div>
        <p>
          Last seen: <span className="text-md">Never</span>
        </p>
      </CardContent>
    </Card>
  );
});
DeviceStatusCard.displayName = "DeviceStatusCard";

export { DeviceStatusCard };
