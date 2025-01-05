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
import { Separator } from "@/components/ui/separator";
import { DoorOpen, IdCard, SlidersHorizontal } from "lucide-react";
import * as React from "react";

interface CardAccessCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

const CardAccessCard = React.forwardRef<HTMLDivElement, CardAccessCardProps>(
  ({ className, id, ...props }, ref) => {
    // todo: fetch data from api with id

    return (
      <Card className={className} ref={ref} {...props}>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-1">
            <IdCard className="size-6" />
            <span>Access</span>
          </CardTitle>
          <CardDescription>
            Number of doors that the card can be used on
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="info" className="text-md">
            <DoorOpen className="mr-1 size-4" />
            <span>32 doors</span>
          </Badge>
          <Separator className="mt-6 h-1 rounded-xl" />
        </CardContent>
        <CardFooter className="justify-end gap-2 max-md:flex-col">
          <Button variant="info" className="max-md:w-full">
            <SlidersHorizontal />
            <span>Edit Doors</span>
          </Button>
        </CardFooter>
      </Card>
    );
  },
);
CardAccessCard.displayName = "CardAccessCard";

export { CardAccessCard };
