"use client";

import { CardActivateButton } from "@/components/cards/access/card-activate-button";
import { CardDisableButton } from "@/components/cards/access/card-disable-button";
import { Badge } from "@/components/ui/badge";
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
import { Hand, OctagonMinus, ShieldCheck } from "lucide-react";
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
            <CardDisableButton id={card.id} />
          ) : (
            <CardActivateButton id={card.id} />
          )}
        </CardFooter>
      </Card>
    );
  },
);
CardStatusCard.displayName = "CardStatusCard";

export { CardStatusCard };
