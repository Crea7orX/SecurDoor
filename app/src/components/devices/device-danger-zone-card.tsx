import { DeviceRestartAlertDialog } from "@/components/devices/command/device-restart-alert-dialog";
import { DeviceDeleteAlertDialog } from "@/components/devices/device-delete-alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type DeviceResponse } from "@/lib/validations/device";
import { Power, Trash, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

interface DeviceDangerZoneCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  device: DeviceResponse;
}

const DeviceDangerZoneCard = React.forwardRef<
  HTMLDivElement,
  DeviceDangerZoneCardProps
>(({ className, device, ...props }, ref) => {
  const t = useTranslations("Device");
  const tButton = useTranslations("Common.button");

  return (
    <Card className={className} ref={ref} {...props}>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-1 text-destructive">
          <TriangleAlert className="size-6" />
          <span>{t("danger_zone.title")}</span>
        </CardTitle>
        <CardDescription>{t("danger_zone.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-stretch gap-2 max-md:flex-col">
        <DeviceRestartAlertDialog id={device.id}>
          <Button
            variant="warning"
            disabled={device.pendingCommand === "restart"}
          >
            <Power />
            <span>{t("reboot.button")}</span>
          </Button>
        </DeviceRestartAlertDialog>
        <DeviceDeleteAlertDialog id={device.id}>
          <Button variant="destructive">
            <Trash />
            <span>{tButton("remove")}</span>
          </Button>
        </DeviceDeleteAlertDialog>
      </CardContent>
    </Card>
  );
});
DeviceDangerZoneCard.displayName = "DeviceDangerZoneCard";

export { DeviceDangerZoneCard };
