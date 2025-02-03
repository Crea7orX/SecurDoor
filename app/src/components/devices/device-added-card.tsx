import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type DeviceResponse } from "@/lib/validations/device";
import { CalendarClock } from "lucide-react";
import * as React from "react";

interface DeviceAddedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  device: DeviceResponse;
}

const DeviceAddedCard = React.forwardRef<HTMLDivElement, DeviceAddedCardProps>(
  ({ className, device, ...props }, ref) => {
    return (
      <Card className={className} ref={ref} {...props}>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-1">
            <CalendarClock className="size-6" />
            <span>Added</span>
          </CardTitle>
          <CardDescription>
            The date and time when the device was added
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="info" className="text-md">
            <CalendarClock className="mr-1 size-4" />
            <span>{new Date(device.createdAt * 1000).toLocaleString()}</span>
          </Badge>
        </CardContent>
      </Card>
    );
  },
);
DeviceAddedCard.displayName = "DeviceAddedCard";

export { DeviceAddedCard };
