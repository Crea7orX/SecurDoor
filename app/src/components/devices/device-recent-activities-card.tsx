import {
  DeviceActivityCard,
  DeviceActivityCardSkeleton,
} from "@/components/devices/device-activity-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Eye, ScrollText } from "lucide-react";
import * as React from "react";

interface DeviceRecentActivitiesCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

const activities = [
  {
    id: "log_90457690234",
    userId: "user_123456789",
    deviceId: "device_123456789",
    createdAt: new Date("2023-01-01T00:00:00.000Z"),
    action: "LOCK",
    actor: "John Doe",
  },
  {
    id: "log_90457690234",
    userId: "user_123456789",
    deviceId: "device_123456789",
    createdAt: new Date("2023-01-01T00:00:00.000Z"),
    action: "UNLOCK",
    actor: "John Doe",
  },
  {
    id: "log_90457690234",
    userId: "user_123456789",
    deviceId: "device_123456789",
    createdAt: new Date("2023-01-01T00:00:00.000Z"),
    action: "LOCKDOWN",
    actor: "John Doe",
  },
];

const DeviceRecentActivitiesCard = React.forwardRef<
  HTMLDivElement,
  DeviceRecentActivitiesCardProps
>(({ className, id, ...props }, ref) => {
  // todo: fetch data from api with id

  return (
    <Card className={cn("h-full bg-border", className)} ref={ref} {...props}>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-1 font-bold">
          <ScrollText className="size-6" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-4 px-2">
        {activities.map((activity) => (
          <DeviceActivityCard key={activity.id} activity={activity} />
        ))}
        <DeviceActivityCardSkeleton />
      </CardContent>
      <CardFooter className="justify-end p-4">
        <Button variant="info" className="max-md:w-full">
          <Eye />
          <span>View all Logs</span>
        </Button>
      </CardFooter>
    </Card>
  );
});
DeviceRecentActivitiesCard.displayName = "DeviceRecentActivitiesCard";

export { DeviceRecentActivitiesCard };
