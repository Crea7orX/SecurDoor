"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDeviceStatusDisplayInfo } from "@/config/device-statuses";
import { useGetDeviceByIdStateQuery } from "@/hooks/api/devices-states/use-get-device-by-id-state-query";
import { useNow } from "@/hooks/use-now";
import { cn } from "@/lib/utils";
import { formatDistance } from "date-fns";
import { CircleDot, CircleDotDashed, EthernetPort } from "lucide-react";
import * as React from "react";

interface DeviceStatusCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

const DeviceStatusCard = React.forwardRef<
  HTMLDivElement,
  DeviceStatusCardProps
>(({ className, id, ...props }, ref) => {
  const { data, isLoading } = useGetDeviceByIdStateQuery({
    id,
    refetchInterval: 5000,
  });

  const [now] = useNow(5000); // re-render every 5s for device status

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
          {now.getTime() - (data?.lastSeenAt ?? 0) * 1000 > 15000 ? (
            <Badge variant="destructive" className="text-md">
              <CircleDotDashed className="mr-1 size-4" />
              <span>Offline</span>
            </Badge>
          ) : (
            <Badge variant="success" className="text-md">
              <CircleDot className="mr-1 size-4" />
              <span>Online</span>
            </Badge>
          )}
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
        {isLoading ? (
          <Skeleton className="h-6 w-48" />
        ) : (
          <p className="text-muted-foreground">
            Last seen:{" "}
            {data?.lastSeenAt
              ? formatDistance(new Date(data.lastSeenAt * 1000), now, {
                  includeSeconds: true,
                  addSuffix: true,
                })
              : "Never"}
          </p>
        )}
      </CardContent>
    </Card>
  );
});
DeviceStatusCard.displayName = "DeviceStatusCard";

export { DeviceStatusCard };
