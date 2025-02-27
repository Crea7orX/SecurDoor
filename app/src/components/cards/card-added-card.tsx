import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type CardResponse } from "@/lib/validations/card";
import { CalendarClock } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import * as React from "react";

interface CardAddedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  card: CardResponse;
}

const CardAddedCard = React.forwardRef<HTMLDivElement, CardAddedCardProps>(
  ({ className, card, ...props }, ref) => {
    const t = useTranslations("Card.added");
    const format = useFormatter();

    return (
      <Card className={className} ref={ref} {...props}>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-1">
            <CalendarClock className="size-6" />
            <span>{t("title")}</span>
          </CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="info" className="text-md">
            <CalendarClock className="mr-1 size-4" />
            <span>
              {format.dateTime(card.createdAt * 1000, {
                dateStyle: "medium",
                timeStyle: "medium",
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              })}
            </span>
          </Badge>
        </CardContent>
      </Card>
    );
  },
);
CardAddedCard.displayName = "CardAddedCard";

export { CardAddedCard };
