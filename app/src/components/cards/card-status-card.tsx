"use client";

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
import { useUpdateCardMutation } from "@/hooks/api/cards/use-update-card-mutation";
import { CardResponse } from "@/lib/validations/card";
import { Hand, OctagonMinus, ShieldCheck } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

interface CardStatusCardProps extends React.HTMLAttributes<HTMLDivElement> {
  card: CardResponse;
}

const CardStatusCard = React.forwardRef<HTMLDivElement, CardStatusCardProps>(
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
      <Card className={className} ref={ref} {...props}>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-1">
            <Hand className="size-6" />
            <span>Status</span>
          </CardTitle>
          <CardDescription>Access status of the card</CardDescription>
        </CardHeader>
        <CardContent>
          {card.active ? (
            <Badge variant="success" className="text-md">
              <ShieldCheck className="mr-1 size-4" />
              <span>Active</span>
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-md">
              <OctagonMinus className="mr-1 size-4" />
              <span>Disabled</span>
            </Badge>
          )}
          <Separator className="mt-6 h-1 rounded-xl" />
        </CardContent>
        <CardFooter className="justify-end gap-2 max-md:flex-col">
          {card.active ? (
            <Button
              variant="destructive"
              disabled={isLoading}
              className="max-md:w-full"
              onClick={() => handleUpdate(false)}
            >
              <OctagonMinus />
              <span>Disable</span>
            </Button>
          ) : (
            <Button
              variant="success"
              disabled={isLoading}
              className="max-md:w-full"
              onClick={() => handleUpdate(true)}
            >
              <ShieldCheck />
              <span>Activate</span>
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  },
);
CardStatusCard.displayName = "CardStatusCard";

export { CardStatusCard };
