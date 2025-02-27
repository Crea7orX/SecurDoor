import { DeviceDeleteAlertDialog } from "@/components/devices/device-delete-alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Power, Trash, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

interface DeviceDangerZoneCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

const DeviceDangerZoneCard = React.forwardRef<
  HTMLDivElement,
  DeviceDangerZoneCardProps
>(({ className, id, ...props }, ref) => {
  const t = useTranslations("Device");
  const tButton = useTranslations("Common.button");

  // todo: fetch data from api with id

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
        <Button variant="warning">
          <Power />
          <span>{t("reboot.button")}</span>
        </Button>
        <DeviceDeleteAlertDialog id={id}>
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
