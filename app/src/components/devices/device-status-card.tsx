import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CircleDotDashed, EthernetPort } from "lucide-react";
import * as React from "react";

interface DeviceStatusCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

const DeviceStatusCard = React.forwardRef<
  HTMLDivElement,
  DeviceStatusCardProps
>(({ className, id, ...props }, ref) => {
  // todo: fetch data from api with id

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
        <Badge variant="destructive" className="text-md w-fit">
          <CircleDotDashed className="mr-1 size-4" />
          <span>Offline</span>
        </Badge>
        <p>
          Last seen: <span className="text-md">Never</span>
        </p>
      </CardContent>
    </Card>
  );
});
DeviceStatusCard.displayName = "DeviceStatusCard";

export { DeviceStatusCard };
