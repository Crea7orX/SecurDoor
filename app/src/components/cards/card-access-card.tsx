"use client";

import { AccessCardsEditDialog } from "@/components/access/cards/access-cards-edit-dialog";
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
import { useGetAllAccessCardsQuery } from "@/hooks/api/access/cards/use-get-all-access-cards-query";
import { DoorOpen, IdCard, SlidersHorizontal } from "lucide-react";
import * as React from "react";

interface CardAccessCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

const CardAccessCard = React.forwardRef<HTMLDivElement, CardAccessCardProps>(
  ({ className, id, ...props }, ref) => {
    const { data, isLoading } = useGetAllAccessCardsQuery({ id });

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
          {isLoading ? (
            <Skeleton className="h-8 w-28" />
          ) : (
            <Badge variant="info" className="text-md">
              <DoorOpen className="mr-1 size-4" />
              <span>{data?.devices.length} doors</span>
              {/*todo: plural or singular*/}
            </Badge>
          )}
          <Separator className="mt-6 h-1 rounded-xl" />
        </CardContent>
        <CardFooter className="justify-end gap-2 max-md:flex-col">
          <AccessCardsEditDialog id={id} devices={data?.devices ?? []}>
            <Button
              variant="info"
              className="max-md:w-full"
              disabled={isLoading}
            >
              <SlidersHorizontal />
              <span>Edit Doors</span>
            </Button>
          </AccessCardsEditDialog>
        </CardFooter>
      </Card>
    );
  },
);
CardAccessCard.displayName = "CardAccessCard";

export { CardAccessCard };
