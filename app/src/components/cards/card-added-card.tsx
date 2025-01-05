import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardResponse } from "@/lib/validations/card";
import { CalendarClock } from "lucide-react";
import * as React from "react";

interface CardAddedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  card: CardResponse;
}

const CardAddedCard = React.forwardRef<HTMLDivElement, CardAddedCardProps>(
  ({ className, card, ...props }, ref) => {
    return (
      <Card className={className} ref={ref} {...props}>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-1">
            <CalendarClock className="size-6" />
            <span>Added</span>
          </CardTitle>
          <CardDescription>
            The date and time when the card was added
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="info" className="text-md">
            <CalendarClock className="mr-1 size-4" />
            <span>{new Date(card.createdAt * 1000).toLocaleString()}</span>
          </Badge>
        </CardContent>
      </Card>
    );
  },
);
CardAddedCard.displayName = "CardAddedCard";

export { CardAddedCard };
