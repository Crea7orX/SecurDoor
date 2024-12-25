import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, IdCard, PlusCircle } from "lucide-react";
import * as React from "react";

interface DeviceAccessCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

const DeviceAccessCard = React.forwardRef<
  HTMLDivElement,
  DeviceAccessCardProps
>(({ className, id, ...props }, ref) => {
  // todo: fetch data from api with id

  return (
    <Card className={className} ref={ref} {...props}>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-1">
          <IdCard className="size-6" />
          <span>Access</span>
        </CardTitle>
        <CardDescription>
          Number of people who have access to the door
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="info" className="text-md">
          <IdCard className="mr-1 size-4" />
          <span>32 cards</span>
        </Badge>
      </CardContent>
      <CardFooter className="justify-end gap-2 max-md:flex-col">
        <Button variant="info" className="max-md:w-full">
          <Eye />
          <span>View Cards</span>
        </Button>
        <Button variant="success" className="max-md:w-full">
          <PlusCircle />
          <span>Add Card</span>
        </Button>
      </CardFooter>
    </Card>
  );
});
DeviceAccessCard.displayName = "DeviceAccessCard";

export { DeviceAccessCard };
