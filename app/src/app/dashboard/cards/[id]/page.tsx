"use client";

import CardsLoading from "@/app/dashboard/cards/loading";
import { CardAccessCard } from "@/components/cards/card-access-card";
import { CardAddedCard } from "@/components/cards/card-added-card";
import { CardDangerZoneCard } from "@/components/cards/card-danger-zone-card";
import { CardHolderCard } from "@/components/cards/card-holder-card";
import { CardStatusCard } from "@/components/cards/card-status-card";
import { LogRecentActivitiesCard } from "@/components/logs/log-recent-activities-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { MasonryItem, MasonryRoot } from "@/components/ui/masonry";
import { useGetCardByIdQuery } from "@/hooks/api/cards/use-get-card-by-id-query";
import { ArrowLeft, IdCard } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CardPageProps {
  params: { id: string };
}

export default function CardPage({ params }: CardPageProps) {
  const t = useTranslations("Card");
  const tButton = useTranslations("Common.button");

  const { data, isLoading } = useGetCardByIdQuery({ id: params.id });

  if (isLoading) {
    return <CardsLoading />;
  }

  if (!data) {
    return notFound();
  }

  return (
    <div className="flex h-full gap-6 p-4">
      <div className="flex w-full max-w-96 flex-col gap-8 max-lg:hidden">
        <Button className="self-start" disabled={isLoading} asChild>
          <Link href="/dashboard/cards">
            <ArrowLeft className="size-4" />
            {tButton("go_back")}
          </Link>
        </Button>
        <LogRecentActivitiesCard id={params.id} />
      </div>

      <div className="flex w-full flex-1 flex-col gap-4">
        <Card className="w-full bg-border">
          <CardHeader className="flex-row flex-wrap items-center justify-center gap-2 space-y-0 p-2">
            <span className="text-2xl font-bold">{t("label")}</span>
            <Badge
              variant="secondary"
              className="max-w-full text-lg font-bold md:max-w-96"
            >
              <IdCard className="mr-1 shrink-0" />
              <span className="truncate">{data.fingerprint.slice(-8)}</span>
            </Badge>
          </CardHeader>
        </Card>

        <Card className="h-full w-full bg-border px-2 py-4">
          <div className="sticky top-0">
            <MasonryRoot gap={16} columnWidth={350} linear>
              <MasonryItem>
                <CardHolderCard card={data} />
              </MasonryItem>
              <MasonryItem>
                <CardStatusCard card={data} />
              </MasonryItem>
              <MasonryItem>
                <CardDangerZoneCard id={params.id} />
              </MasonryItem>
              <MasonryItem>
                <CardAddedCard card={data} />
              </MasonryItem>
              <MasonryItem>
                <CardAccessCard id={params.id} />
              </MasonryItem>
            </MasonryRoot>
          </div>
        </Card>

        <LogRecentActivitiesCard className="lg:hidden" id={params.id} />
      </div>
    </div>
  );
}
