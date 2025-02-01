"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateCardMutation } from "@/hooks/api/cards/use-update-card-mutation";
import { cn } from "@/lib/utils";
import { type CardResponse } from "@/lib/validations/card";
import {
  OctagonMinus,
  Settings,
  ShieldCheck,
  ShieldQuestion,
  User,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

interface CardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  card: CardResponse;
}

const CardCard = React.forwardRef<HTMLDivElement, CardCardProps>(
  ({ className, card, ...props }, ref) => {
    const { mutateAsync: update } = useUpdateCardMutation({
      id: card.id,
    });
    const [isLoading, setIsLoading] = React.useState(false);

    const handleUpdate = async (value: boolean) => {
      setIsLoading(true);
      const toastId = toast.loading(
        value ? "Activating card..." : "Disabling card...",
      );
      await update({
        active: value,
      })
        .then(() => {
          if (value) {
            toast.success("Card activated!", {
              id: toastId,
            });
          } else {
            toast.warning("Card disabled!", {
              id: toastId,
            });
          }
        })
        .catch(() => {
          toast.error(
            value ? "Failed to activate card!" : "Failed to disable card!",
            {
              id: toastId,
            },
          );
        });

      setIsLoading(false);
    };

    return (
      <Card
        className={cn("bg-border lg:min-w-[360px]", className)}
        ref={ref}
        {...props}
      >
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <CardTitle>Card {card.fingerprint.slice(-8)}</CardTitle>
          <Separator
            orientation="vertical"
            className="h-6 bg-card-foreground"
          />
          {card.active ? (
            <Badge variant="success">
              <ShieldCheck className="mr-1 size-4" />
              <span>ACTIVE</span>
            </Badge>
          ) : (
            <Badge variant="destructive">
              <OctagonMinus className="mr-1 size-4" />
              <span>DISABLED</span>
            </Badge>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-3 rounded-xl bg-card pt-2">
          <div className="flex flex-col gap-2">
            <Label className="text-md">Holder</Label>
            {card.holder ? (
              <Badge variant="info" className="text-md h-8">
                <User className="mr-1" />
                <span>{card.holder}</span>
              </Badge>
            ) : (
              <Badge variant="warning" className="text-md h-8">
                <ShieldQuestion className="mr-1" />
                <span>Unknown</span>
              </Badge>
            )}
          </div>
          <Separator className="h-1 rounded-xl" />
          <div className="flex gap-2">
            <Button className="flex-1" asChild>
              <Link href={`/dashboard/cards/${card.id}`}>
                <Settings className="size-4" />
                Settings
              </Link>
            </Button>
            {card.active ? (
              <Button
                variant="destructive"
                disabled={isLoading}
                onClick={() => handleUpdate(false)}
              >
                <OctagonMinus className="size-4" />
                <span>Disable</span>
              </Button>
            ) : (
              <Button
                variant="success"
                disabled={isLoading}
                onClick={() => handleUpdate(true)}
              >
                <ShieldCheck className="size-4" />
                <span>Activate</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  },
);
CardCard.displayName = "CardCard";

const CardCardSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <Card
      className={cn("bg-border lg:min-w-[360px]", className)}
      ref={ref}
      {...props}
    >
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <Skeleton className="h-6 w-40" />
        <Separator orientation="vertical" className="h-6 bg-card-foreground" />
        <Skeleton className="h-6 w-24" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3 rounded-xl bg-card pt-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8" />
        </div>
        <Separator className="h-1 rounded-xl" />
        <div className="flex gap-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-24" />
        </div>
      </CardContent>
    </Card>
  );
});
CardCardSkeleton.displayName = "CardCardSkeleton";

export { CardCard, CardCardSkeleton };
