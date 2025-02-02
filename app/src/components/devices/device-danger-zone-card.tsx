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
import * as React from "react";

interface DeviceDangerZoneCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

const DeviceDangerZoneCard = React.forwardRef<
  HTMLDivElement,
  DeviceDangerZoneCardProps
>(({ className, id, ...props }, ref) => {
  // todo: fetch data from api with id

  return (
    <Card className={className} ref={ref} {...props}>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-1 text-destructive">
          <TriangleAlert className="size-6" />
          <span>Danger Zone</span>
        </CardTitle>
        <CardDescription>
          Dangerous actions that can not be undone
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-stretch gap-2 max-md:flex-col">
        <Button variant="warning">
          <Power />
          <span>Reboot</span>
        </Button>
        <DeviceDeleteAlertDialog id={id}>
          <Button variant="destructive">
            <Trash />
            <span>Remove</span>
          </Button>
        </DeviceDeleteAlertDialog>
      </CardContent>
    </Card>
  );
});
DeviceDangerZoneCard.displayName = "DeviceDangerZoneCard";

export { DeviceDangerZoneCard };
