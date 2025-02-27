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
    return notFound(); // todo: i18n 404 page
  }

  return (
    <div className="flex flex-1 gap-6 p-4">
      <div className="flex w-96 flex-col gap-8 max-lg:hidden">
        <Button className="self-start" disabled={isLoading} asChild>
          <Link href="/dashboard/cards">
            <ArrowLeft className="size-4" />
            {tButton("go_back")}
          </Link>
        </Button>
        <LogRecentActivitiesCard id={params.id} />
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <Card className="w-full bg-border">
          <CardHeader className="flex-row items-center justify-center gap-2 space-y-0 p-2">
            <span className="text-2xl font-bold">{t("label")}</span>
            <Badge variant="secondary" className="text-lg font-bold">
              <IdCard className="mr-1 shrink-0" />
              {data.fingerprint.slice(-8)}
            </Badge>
          </CardHeader>
        </Card>

        <Card className="h-full w-full bg-border px-2 py-4">
          <div className="sticky top-0 flex flex-wrap justify-center">
            <div className="flex w-full flex-col gap-4 p-2 2xl:w-1/2 min-[1920px]:w-1/3">
              <CardHolderCard card={data} />
              <CardAddedCard card={data} />
            </div>
            <div className="flex w-full flex-col gap-4 p-2 2xl:w-1/2 min-[1920px]:w-1/3">
              <CardStatusCard card={data} />
              <CardAccessCard id={params.id} />
            </div>
            <div className="flex w-full flex-col gap-4 p-2 2xl:w-1/2 min-[1920px]:w-1/3">
              <CardDangerZoneCard id={params.id} />
            </div>
          </div>
        </Card>

        <LogRecentActivitiesCard className="lg:hidden" id={params.id} />
      </div>
    </div>
  );
}
