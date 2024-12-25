import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Construction, Lock, LockOpen } from "lucide-react";
import * as React from "react";

interface DeviceActivityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  activity: any;
}

const ActivitiesDisplayPairs = {
  UNLOCK: {
    icon: <LockOpen className="mr-1 size-4" />,
    text: "Unlocked",
    color: "success",
  },
  LOCK: {
    icon: <Lock className="mr-1 size-4" />,
    text: "Locked",
    color: "destructive",
  },
  LOCKDOWN: {
    icon: <Construction className="mr-1 size-4" />,
    text: "Locked Down",
    color: "destructive",
  },
};

const DeviceActivityCard = React.forwardRef<
  HTMLDivElement,
  DeviceActivityCardProps
>(({ className, activity, ...props }, ref) => {
  return (
    <Card className={className} ref={ref} {...props}>
      <CardHeader className="p-4 pb-2">
        <Badge
          variant={ActivitiesDisplayPairs[activity.action].color}
          className="text-md h-8 w-fit"
        >
          {ActivitiesDisplayPairs[activity.action].icon}
          <span>{ActivitiesDisplayPairs[activity.action].text}</span>
        </Badge>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p>
          by <span className="font-semibold">{activity.actor}</span>
        </p>
        <p>
          on{" "}
          <span className="font-semibold">
            {activity.createdAt.toLocaleDateString()}
          </span>
        </p>
      </CardContent>
    </Card>
  );
});
DeviceActivityCard.displayName = "DeviceActivityCard";

const DeviceActivityCardSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <Card className={className} ref={ref} {...props}>
      <CardHeader className="p-4 pb-2">
        <Skeleton className="h-8 w-48" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-4 pt-0">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-32" />
      </CardContent>
    </Card>
  );
});
DeviceActivityCardSkeleton.displayName = "DeviceActivityCardSkeleton";

export { DeviceActivityCard, DeviceActivityCardSkeleton };
