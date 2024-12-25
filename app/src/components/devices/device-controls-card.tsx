import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BellElectric,
  Construction,
  Lock,
  RotateCw,
  Settings,
  Wrench,
} from "lucide-react";
import * as React from "react";

interface DeviceControlsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

const DeviceControlsCard = React.forwardRef<
  HTMLDivElement,
  DeviceControlsCardProps
>(({ className, id, ...props }, ref) => {
  // todo: fetch data from api with id

  return (
    <Card className={className} ref={ref} {...props}>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-1">
          <Wrench className="size-6" />
          <span>Controls</span>
        </CardTitle>
        <CardDescription>Controls for the device</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex gap-2 max-md:flex-col">
          <Button variant="destructive">
            <Lock />
            <span>Lock</span>
          </Button>
          <Button variant="info">
            <RotateCw />
            <span>Refresh</span>
          </Button>
          <Button className="flex-1">
            <Settings />
            <span>Settings</span>
          </Button>
        </div>
        <Separator className="h-1 rounded-xl" />
        <div className="flex gap-2 max-md:flex-col">
          <Button variant="destructive" className="w-full">
            <Construction />
            <span>LOCKDOWN</span>
          </Button>
          <Button variant="warning" className="w-full">
            <BellElectric />
            <span>EVACUATION</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});
DeviceControlsCard.displayName = "DeviceControlsCard";

export { DeviceControlsCard };
