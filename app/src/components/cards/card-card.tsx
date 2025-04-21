"use client";

import { CardActivateButton } from "@/components/cards/access/card-activate-button";
import { CardDisableButton } from "@/components/cards/access/card-disable-button";
import { CardStatusBadge } from "@/components/cards/access/card-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { type CardResponse } from "@/lib/validations/card";
import { Settings, ShieldQuestion, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import * as React from "react";

interface CardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  card: CardResponse;
}

const CardCard = React.forwardRef<HTMLDivElement, CardCardProps>(
  ({ className, card, ...props }, ref) => {
    const t = useTranslations("Card");
    const tButton = useTranslations("Common.button");

    return (
      <Card
        className={cn(
          "w-full max-w-[360px] bg-border lg:min-w-[360px]",
          className,
        )}
        ref={ref}
        {...props}
      >
        <CardHeader className="items-center gap-2 space-y-0 md:flex-row">
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
            className="h-6 bg-card-foreground max-md:hidden"
          />
          <CardStatusBadge active={card.active} />
        </CardHeader>
        <CardContent className="flex flex-col gap-3 rounded-xl bg-card pt-2">
          <div className="flex flex-col gap-2">
            <Label className="text-md">{t("field.holder.label")}</Label>
            {card.holder ? (
              <Badge variant="info" className="text-md gap-1">
                <User className="shrink-0" />
                <span>{card.holder}</span>
              </Badge>
            ) : (
              <Badge variant="warning" className="text-md gap-1">
                <ShieldQuestion className="shrink-0" />
                <span>{t("field.holder.unknown")}</span>
              </Badge>
            )}
          </div>
          <Separator className="h-1 rounded-xl" />
          <div className="flex flex-wrap gap-2">
            <Button className="flex-1" asChild>
              <Link href={`/dashboard/cards/${card.id}`}>
                <Settings className="size-4" />
                {tButton("settings")}
              </Link>
            </Button>
            {card.active ? (
              <CardDisableButton className="flex-1" id={card.id} />
            ) : (
              <CardActivateButton className="flex-1" id={card.id} />
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
      <CardHeader className="items-center gap-2 space-y-0 md:flex-row">
        <Skeleton className="h-6 w-full max-w-40" />
        <Separator
          orientation="vertical"
          className="h-6 bg-card-foreground max-md:hidden"
        />
        <Skeleton className="h-6 w-24" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3 rounded-xl bg-card pt-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-full max-w-32" />
          <Skeleton className="h-8" />
        </div>
        <Separator className="h-1 rounded-xl" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-9 min-w-40 flex-1" />
          <Skeleton className="h-9 min-w-24 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
});
CardCardSkeleton.displayName = "CardCardSkeleton";

export { CardCard, CardCardSkeleton };
