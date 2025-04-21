import { Badge } from "@/components/ui/badge";
import {
  type DeviceStatusDisplayInfos,
  getDeviceStatusDisplayInfo,
} from "@/config/device-statuses";
import { cn } from "@/lib/utils";
import { CircleDot, CircleDotDashed } from "lucide-react";
import { useNow, useTranslations } from "next-intl";
import * as React from "react";

interface DeviceStatusBadgesProps
  extends React.ComponentPropsWithoutRef<typeof Badge> {
  lastSeenAt: number;
  status: keyof typeof DeviceStatusDisplayInfos;
}

export function DeviceStatusBadges({
  className,
  lastSeenAt,
  status,
  ...props
}: DeviceStatusBadgesProps) {
  const t = useTranslations();

  const now = useNow({
    updateInterval: 1000,
  }); // re-render every 1s for device status

  const deviceStatusDisplayInfo = getDeviceStatusDisplayInfo(status);

  return (
    <>
      {now.getTime() - (lastSeenAt ?? 0) * 1000 > 15000 ? (
        <Badge className={className} {...props} variant="destructive">
          <CircleDotDashed className="mr-1 size-4" />
          <span>{t("Device.status.state.offline")}</span>
        </Badge>
      ) : (
        <Badge className={className} {...props} variant="success">
          <CircleDot className="mr-1 size-4" />
          <span>{t("Device.status.state.online")}</span>
        </Badge>
      )}
      {status !== "adopted" && (
        <Badge
          className={className}
          {...props}
          variant={deviceStatusDisplayInfo.color}
        >
          <deviceStatusDisplayInfo.icon
            className={cn(
              "mr-1 size-4",
              `fill-${deviceStatusDisplayInfo.color}`,
            )}
          />
          <span>{t(deviceStatusDisplayInfo.text)}</span>
        </Badge>
      )}
    </>
  );
}
