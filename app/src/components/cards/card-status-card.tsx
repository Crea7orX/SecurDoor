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
import { type CardResponse } from "@/lib/validations/card";
import { Hand, OctagonMinus, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { toast } from "sonner";

interface CardStatusCardProps extends React.HTMLAttributes<HTMLDivElement> {
  card: CardResponse;
}

const CardStatusCard = React.forwardRef<HTMLDivElement, CardStatusCardProps>(
  ({ className, card, ...props }, ref) => {
    const t = useTranslations("Card.status");

    const { mutateAsync: update } = useUpdateCardMutation({
      id: card.id,
    });
    const [isLoading, setIsLoading] = React.useState(false);

    const handleUpdate = async (value: boolean) => {
      setIsLoading(true);
      const toastId = toast.loading(
        value
          ? t("notification.activate.loading")
          : t("notification.disable.loading"),
      );
      await update({
        active: value,
      })
        .then(() => {
          if (value) {
            toast.success(t("notification.activate.success"), {
              id: toastId,
            });
          } else {
            toast.warning(t("notification.disable.success"), {
              id: toastId,
            });
          }
        })
        .catch(() => {
          toast.error(
            value
              ? t("notification.activate.error")
              : t("notification.disable.error"),
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
            <span>{t("title")}</span>
          </CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {card.active ? (
            <Badge variant="success" className="text-md">
              <ShieldCheck className="mr-1 size-4" />
              <span>{t("state.active")}</span>
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-md">
              <OctagonMinus className="mr-1 size-4" />
              <span>{t("state.disabled")}</span>
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
              <span>{t("button.disable")}</span>
            </Button>
          ) : (
            <Button
              variant="success"
              disabled={isLoading}
              className="max-md:w-full"
              onClick={() => handleUpdate(true)}
            >
              <ShieldCheck />
              <span>{t("button.activate")}</span>
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  },
);
CardStatusCard.displayName = "CardStatusCard";

export { CardStatusCard };
