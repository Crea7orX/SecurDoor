"use client";

import { AccessCardsEditDialog } from "@/components/access/cards/access-cards-edit-dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllAccessCardsQuery } from "@/hooks/api/access/cards/use-get-all-access-cards-query";
import { useGetAllCardTagsQuery } from "@/hooks/api/cards/tags/use-get-all-card-tags-query";
import { DoorOpen, IdCard, SlidersHorizontal, Tag } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

interface CardAccessCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

const CardAccessCard = React.forwardRef<HTMLDivElement, CardAccessCardProps>(
  ({ className, id, ...props }, ref) => {
    const t = useTranslations("Card.access");

    const { data: devicesData, isLoading: devicesIsLoading } =
      useGetAllAccessCardsQuery({ id });
    const { data: tagsData, isLoading: tagsIsLoading } = useGetAllCardTagsQuery(
      { id },
    );

    return (
      <Card className={className} ref={ref} {...props}>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-1">
            <IdCard className="size-6" />
            <span>{t("title")}</span>
          </CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {devicesIsLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <Badge variant="info" className="text-md">
                <DoorOpen className="mr-1 size-4" />
                <span>
                  {t("devices", { count: devicesData?.devices.length ?? 0 })}
                </span>
              </Badge>
            )}
            {tagsIsLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <Badge variant="info" className="text-md">
                <Tag className="mr-1 size-4" />
                <span>{t("tags", { count: tagsData?.tags.length ?? 0 })}</span>
              </Badge>
            )}
          </div>
          <Separator className="mt-6 h-1 rounded-xl" />
        </CardContent>
        <CardFooter className="justify-end gap-2 max-md:flex-col">
          <AccessCardsEditDialog
            id={id}
            devices={devicesData?.devices ?? []}
            tags={tagsData?.tags ?? []}
          >
            <Button
              variant="info"
              className="max-md:w-full"
              disabled={devicesIsLoading}
            >
              <SlidersHorizontal />
              <span>{t("edit_button")}</span>
            </Button>
          </AccessCardsEditDialog>
        </CardFooter>
      </Card>
    );
  },
);
CardAccessCard.displayName = "CardAccessCard";

export { CardAccessCard };
