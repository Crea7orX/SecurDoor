"use client";

import { CardActivateButton } from "@/components/cards/access/card-activate-button";
import { CardDisableButton } from "@/components/cards/access/card-disable-button";
import { CardStatusBadge } from "@/components/cards/access/card-status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type CardResponse } from "@/lib/validations/card";
import { Hand } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

interface CardStatusCardProps extends React.HTMLAttributes<HTMLDivElement> {
  card: CardResponse;
}

const CardStatusCard = React.forwardRef<HTMLDivElement, CardStatusCardProps>(
  ({ className, card, ...props }, ref) => {
    const t = useTranslations("Card.status");

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
          <CardStatusBadge className="text-md" active={card.active} />
          <Separator className="mt-6 h-1 rounded-xl" />
        </CardContent>
        <CardFooter className="justify-end gap-2 max-md:flex-col">
          {card.active ? (
            <CardDisableButton className="max-md:w-full" id={card.id} />
          ) : (
            <CardActivateButton className="max-md:w-full" id={card.id} />
          )}
        </CardFooter>
      </Card>
    );
  },
);
CardStatusCard.displayName = "CardStatusCard";

export { CardStatusCard };
