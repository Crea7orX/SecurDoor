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
import { useTranslations } from "next-intl";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

interface CardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  card: CardResponse;
}

const CardCard = React.forwardRef<HTMLDivElement, CardCardProps>(
  ({ className, card, ...props }, ref) => {
    const t = useTranslations("Card");
    const tButton = useTranslations("Common.button");

    // todo: export activating/disabling card in common component

    const { mutateAsync: update } = useUpdateCardMutation({
      id: card.id,
    });
    const [isLoading, setIsLoading] = React.useState(false);

    const handleUpdate = async (value: boolean) => {
      setIsLoading(true);
      const toastId = toast.loading(
        value
          ? t("status.notification.activate.loading")
          : t("status.notification.disable.loading"),
      );
      await update({
        active: value,
      })
        .then(() => {
          if (value) {
            toast.success(t("status.notification.activate.success"), {
              id: toastId,
            });
          } else {
            toast.warning(t("status.notification.disable.success"), {
              id: toastId,
            });
          }
        })
        .catch(() => {
          toast.error(
            value
              ? t("status.notification.activate.error")
              : t("status.notification.disable.error"),
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
          <CardTitle>
            {t.rich("card.title", {
              fingerprint: card.fingerprint.slice(-8),
              semibold: (chunks) => (
                <span className="font-semibold">{chunks}</span>
              ),
            })}
          </CardTitle>
          <Separator
            orientation="vertical"
            className="h-6 bg-card-foreground"
          />
          {card.active ? (
            <Badge variant="success">
              <ShieldCheck className="mr-1 size-4" />
              <span>{t("card.state.active")}</span>
            </Badge>
          ) : (
            <Badge variant="destructive">
              <OctagonMinus className="mr-1 size-4" />
              <span>{t("card.state.disabled")}</span>
            </Badge>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-3 rounded-xl bg-card pt-2">
          <div className="flex flex-col gap-2">
            <Label className="text-md">{t("field.holder.label")}</Label>
            {card.holder ? (
              <Badge variant="info" className="text-md h-8">
                <User className="mr-1" />
                <span>{card.holder}</span>
              </Badge>
            ) : (
              <Badge variant="warning" className="text-md h-8">
                <ShieldQuestion className="mr-1" />
                <span>{t("field.holder.unknown")}</span>
              </Badge>
            )}
          </div>
          <Separator className="h-1 rounded-xl" />
          <div className="flex gap-2">
            <Button className="flex-1" asChild>
              <Link href={`/dashboard/cards/${card.id}`}>
                <Settings className="size-4" />
                {tButton("settings")}
              </Link>
            </Button>
            {card.active ? (
              <Button
                variant="destructive"
                disabled={isLoading}
                onClick={() => handleUpdate(false)}
              >
                <OctagonMinus className="size-4" />
                <span>{t("status.button.disable")}</span>
              </Button>
            ) : (
              <Button
                variant="success"
                disabled={isLoading}
                onClick={() => handleUpdate(true)}
              >
                <ShieldCheck className="size-4" />
                <span>{t("status.button.activate")}</span>
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
      className={cn(
        "w-full max-w-[360px] bg-border md:min-w-[360px]",
        className,
      )}
      ref={ref}
      {...props}
    >
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <Skeleton className="h-6 w-full max-w-40" />
        <Separator orientation="vertical" className="h-6 bg-card-foreground" />
        <Skeleton className="h-6 w-24" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3 rounded-xl bg-card pt-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-full max-w-32" />
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
