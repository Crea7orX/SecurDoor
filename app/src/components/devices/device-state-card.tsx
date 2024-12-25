import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Hand, LockOpen } from "lucide-react";
import * as React from "react";

interface DeviceStateCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

const DeviceStateCard = React.forwardRef<HTMLDivElement, DeviceStateCardProps>(
  ({ className, id, ...props }, ref) => {
    // todo: fetch data from api with id

    return (
      <Card className={className} ref={ref} {...props}>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-1">
            <Hand className="size-6" />
            <span>State</span>
          </CardTitle>
          <CardDescription>State of the door lock</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="success" className="text-md">
            <LockOpen className="mr-1 size-4" />
            <span>Unlocked</span>
          </Badge>
        </CardContent>
      </Card>
    );
  },
);
DeviceStateCard.displayName = "DeviceStateCard";

export { DeviceStateCard };
