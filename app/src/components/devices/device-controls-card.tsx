"use client";

import { DeviceLockButton } from "@/components/devices/access/device-lock-button";
import { DeviceUnlockButton } from "@/components/devices/access/device-unlock-button";
import { DeviceEmergencyAlertDialog } from "@/components/devices/device-emergency-alert-dialog";
import { DeviceEmergencyClearAlertDialog } from "@/components/devices/device-emergency-clear-alert-dialog";
import { DeviceSettingsDialog } from "@/components/devices/device-settings-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { type DeviceResponse } from "@/lib/validations/device";
import { useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  BellElectric,
  Construction,
  RotateCw,
  Settings,
  Wrench,
} from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { toast } from "sonner";

interface DeviceControlsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  device: DeviceResponse;
}

const DeviceControlsCard = React.forwardRef<
  HTMLDivElement,
  DeviceControlsCardProps
>(({ className, device, ...props }, ref) => {
  const t = useTranslations("Device");
  const tButton = useTranslations("Common.button");

  const queryClient = useQueryClient();

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    const toastId = toast.loading(
      t("controls.basic.refresh.notification.loading"),
    );

    await queryClient.invalidateQueries({
      queryKey: ["Devices", "Get", device.id],
    });
    await queryClient.invalidateQueries({
      queryKey: ["DevicesState", "Get", device.id],
    });

    toast.success(t("controls.basic.refresh.notification.success"), {
      id: toastId,
    });

    setTimeout(() => setIsRefreshing(false), 5000); // disable button for 5 seconds
  };

  return (
    <Card className={className} ref={ref} {...props}>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-1">
          <Wrench className="size-6" />
          <span>{t("controls.header")}</span>
        </CardTitle>
        <CardDescription>{t("controls.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Label className="text-md">{t("controls.basic.header")}</Label>
        <div className="flex flex-wrap gap-2 max-md:flex-col">
          {!device.state ? (
            <Skeleton className="h-9 w-24" />
          ) : device.state.isLockedState ? (
            <DeviceUnlockButton className="flex-1" device={device} />
          ) : (
            <DeviceLockButton className="flex-1" device={device} />
          )}
          <Button
            variant="info"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RotateCw />
            <span>{t("controls.basic.refresh.button")}</span>
          </Button>
          <DeviceSettingsDialog device={device}>
            <Button className="flex-1">
              <Settings />
              <span>{tButton("settings")}</span>
            </Button>
          </DeviceSettingsDialog>
        </div>
        <Separator className="h-1 rounded-xl" />
        <Label className="text-md">{t("controls.emergency.header")}</Label>
        <div className="flex gap-2 max-md:flex-col">
          <DeviceEmergencyAlertDialog id={device.id} state="lockdown">
            <Button
              variant="destructive"
              className="w-full"
              disabled={device.emergencyState === "lockdown"}
            >
              <Construction />
              <span>{t("emergency.button.lockdown")}</span>
            </Button>
          </DeviceEmergencyAlertDialog>
          <DeviceEmergencyAlertDialog id={device.id} state="evacuation">
            <Button
              variant="warning"
              className="w-full"
              disabled={device.emergencyState === "evacuation"}
            >
              <BellElectric />
              <span>{t("emergency.button.evacuation")}</span>
            </Button>
          </DeviceEmergencyAlertDialog>
        </div>
        {device.emergencyState && (
          <DeviceEmergencyClearAlertDialog id={device.id}>
            <Button variant="info" className="w-full">
              <Activity />
              <span>{t("emergency.button.clear")}</span>
            </Button>
          </DeviceEmergencyClearAlertDialog>
        )}
      </CardContent>
    </Card>
  );
});
DeviceControlsCard.displayName = "DeviceControlsCard";

export { DeviceControlsCard };
