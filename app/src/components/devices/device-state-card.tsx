import { DeviceStateBadges } from "@/components/devices/access/device-state-badges";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type DeviceResponse } from "@/lib/validations/device";
import { Hand } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

interface DeviceStateCardProps extends React.HTMLAttributes<HTMLDivElement> {
  device: DeviceResponse;
}

const DeviceStateCard = React.forwardRef<HTMLDivElement, DeviceStateCardProps>(
  ({ className, device, ...props }, ref) => {
    const t = useTranslations("Device.state");

    return (
      <Card className={className} ref={ref} {...props}>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-1">
            <Hand className="size-6" />
            <span>{t("title")}</span>
          </CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          {!device.state ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <DeviceStateBadges
              className="text-md"
              isLockedState={device.state.isLockedState}
              emergencyState={device.emergencyState}
            />
          )}
        </CardContent>
      </Card>
    );
  },
);
DeviceStateCard.displayName = "DeviceStateCard";

export { DeviceStateCard };
