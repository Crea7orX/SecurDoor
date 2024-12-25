import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarClock } from "lucide-react";
import * as React from "react";

interface DeviceAddedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

const DeviceAddedCard = React.forwardRef<HTMLDivElement, DeviceAddedCardProps>(
  ({ className, id, ...props }, ref) => {
    // todo: fetch data from api with id

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
            <span>2023-01-01 12:00:00</span>
          </Badge>
        </CardContent>
      </Card>
    );
  },
);
DeviceAddedCard.displayName = "DeviceAddedCard";

export { DeviceAddedCard };
