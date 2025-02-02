"use client";

import { AccessDevicesEditDialog } from "@/components/access/devices/access-devices-edit-dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllAccessDevicesQuery } from "@/hooks/api/access/devices/use-get-all-access-devices-query";
import { IdCard, SlidersHorizontal } from "lucide-react";
import * as React from "react";

interface DeviceAccessCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

const DeviceAccessCard = React.forwardRef<
  HTMLDivElement,
  DeviceAccessCardProps
>(({ className, id, ...props }, ref) => {
  const { data, isLoading } = useGetAllAccessDevicesQuery({ id });

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
        {isLoading ? (
          <Skeleton className="h-8 w-28" />
        ) : (
          <Badge variant="info" className="text-md">
            <IdCard className="mr-1 size-4" />
            <span>{data?.cards.length} cards</span>
            {/*todo: plural or singular*/}
          </Badge>
        )}
        <Separator className="mt-6 h-1 rounded-xl" />
      </CardContent>
      <CardFooter className="justify-end gap-2 max-md:flex-col">
        <AccessDevicesEditDialog id={id} cards={data?.cards ?? []}>
          <Button variant="info" className="max-md:w-full" disabled={isLoading}>
            <SlidersHorizontal />
            <span>Edit Cards</span>
          </Button>
        </AccessDevicesEditDialog>
      </CardFooter>
    </Card>
  );
});
DeviceAccessCard.displayName = "DeviceAccessCard";

export { DeviceAccessCard };
