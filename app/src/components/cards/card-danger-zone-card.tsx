"use client";

import { CardDeleteAlertDialog } from "@/components/cards/card-delete-alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

interface CardDangerZoneCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

const CardDangerZoneCard = React.forwardRef<
  HTMLDivElement,
  CardDangerZoneCardProps
>(({ className, id, ...props }, ref) => {
  const t = useTranslations("Card");
  const tButton = useTranslations("Common.button");

  return (
    <Card className={className} ref={ref} {...props}>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-1 text-destructive">
          <TriangleAlert className="size-6" />
          <span>{t("danger_zone.title")}</span>
        </CardTitle>
        <CardDescription>{t("danger_zone.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-stretch gap-2 max-md:flex-col">
        <CardDeleteAlertDialog id={id}>
          <Button variant="destructive">
            <Trash />
            <span>{tButton("remove")}</span>
          </Button>
        </CardDeleteAlertDialog>
      </CardContent>
    </Card>
  );
});
CardDangerZoneCard.displayName = "CardDangerZoneCard";

export { CardDangerZoneCard };
