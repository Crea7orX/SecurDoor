"use client";

import { DeviceStatusBadges } from "@/components/devices/access/device-status-badges";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type DeviceResponse } from "@/lib/validations/device";
import { EthernetPort } from "lucide-react";
import { useFormatter, useNow, useTranslations } from "next-intl";
import * as React from "react";

interface DeviceStatusCardProps extends React.HTMLAttributes<HTMLDivElement> {
  device: DeviceResponse;
}

const DeviceStatusCard = React.forwardRef<
  HTMLDivElement,
  DeviceStatusCardProps
>(({ className, device, ...props }, ref) => {
  const t = useTranslations("Device.status");
  const format = useFormatter();
  const now = useNow({
    updateInterval: 1000,
  }); // re-render every 1s for device status

  return (
    <Card className={className} ref={ref} {...props}>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-1">
          <EthernetPort className="size-6" />
          <span>{t("title")}</span>
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <DeviceStatusBadges
            className="text-md"
            lastSeenAt={device.state?.lastSeenAt ?? 0}
            status={device.state?.status ?? "unknown"}
          />
        </div>
        {!device.state ? (
          <Skeleton className="h-6 w-48" />
        ) : (
          <p className="text-muted-foreground">
            {t.rich("last_seen.text", {
              date: device.state?.lastSeenAt
                ? format.relativeTime(device.state.lastSeenAt * 1000, {
                    now,
                    style: "long",
                  })
                : t("last_seen.never"),
              semibold: (chunks) => (
                <span className="font-semibold">{chunks}</span>
              ),
            })}
          </p>
        )}
      </CardContent>
    </Card>
  );
});
DeviceStatusCard.displayName = "DeviceStatusCard";

export { DeviceStatusCard };
