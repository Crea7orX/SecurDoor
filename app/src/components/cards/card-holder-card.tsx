import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InputInline } from "@/components/ui/input-inline";
import { cn } from "@/lib/utils";
import { CardResponse } from "@/lib/validations/card";
import { User } from "lucide-react";
import * as React from "react";

interface CardHolderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  card: CardResponse;
}

const CardHolderCard = React.forwardRef<HTMLDivElement, CardHolderCardProps>(
  ({ className, card, ...props }, ref) => {
    return (
      <Card className={className} ref={ref} {...props}>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-1">
            <User className="size-6" />
            <span>Holder</span>
          </CardTitle>
          <CardDescription>Holder of the card</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <InputInline
            className={cn(
              "bg-secondary text-secondary-foreground",
              !card.holder && "text-muted-foreground",
            )}
            value={card.holder ?? ""}
            placeholder={!card.holder ? "Unknown" : "Holder"}
          />
        </CardContent>
      </Card>
    );
  },
);
CardHolderCard.displayName = "CardHolderCard";

export { CardHolderCard };
