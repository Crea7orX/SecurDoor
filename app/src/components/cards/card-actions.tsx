"use client";

import { Button } from "@/components/ui/button";
import { useUpdateCardMutation } from "@/hooks/api/cards/use-update-card-mutation";
import { cn } from "@/lib/utils";
import { type CardResponse } from "@/lib/validations/card";
import { OctagonMinus, Settings, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

interface CardActionsProps extends React.ComponentProps<"div"> {
  card: CardResponse;
}

export function CardActions({ className, card, ...props }: CardActionsProps) {
  const t = useTranslations("Card.status.notification");

  const { mutateAsync: update } = useUpdateCardMutation({
    id: card.id,
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const handleStateUpdate = (action: "activate" | "disable") => {
    setIsLoading(true);

    const toastId = toast.loading(t(`${action}.loading`));

    update({
      active: action === "activate",
    })
      .then(() => {
        toast.success(t(`${action}.success`), {
          id: toastId,
        });
      })
      .catch(() => {
        toast.error(t(`${action}.error`), {
          id: toastId,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div
      className={cn(
        "ml-auto w-fit whitespace-nowrap rounded-md border",
        className,
      )}
      {...props}
    >
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "rounded-r-none border-0 !text-success shadow-none",
          card.active && "!text-destructive",
        )}
        disabled={isLoading}
        onClick={() => handleStateUpdate(card.active ? "disable" : "activate")}
      >
        {card.active ? <OctagonMinus /> : <ShieldCheck />}
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-l-none border-0 border-l shadow-none"
        asChild
      >
        <Link href={`/dashboard/cards/${card.id}`}>
          <Settings />
        </Link>
      </Button>
    </div>
  );
}
