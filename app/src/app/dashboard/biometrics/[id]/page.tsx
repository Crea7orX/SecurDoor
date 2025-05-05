"use client";

import BiometricsLoading from "@/app/dashboard/biometrics/loading";
import { BiometricAccessCard } from "@/components/biometrics/biometric-access-card";
import { BiometricAddedCard } from "@/components/biometrics/biometric-added-card";
import { BiometricDangerZoneCard } from "@/components/biometrics/biometric-danger-zone-card";
import { BiometricIndividualCard } from "@/components/biometrics/biometric-individual-card";
import { BiometricStatusCard } from "@/components/biometrics/biometric-status-card";
import { LogRecentActivitiesCard } from "@/components/logs/log-recent-activities-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { MasonryItem, MasonryRoot } from "@/components/ui/masonry";
import { useGetBiometricByIdQuery } from "@/hooks/api/biometrics/use-get-biometric-by-id-query";
import { ArrowLeft, Fingerprint } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BiometricPageProps {
  params: { id: string };
}

export default function BiometricPage({ params }: BiometricPageProps) {
  const t = useTranslations("Biometric");
  const tButton = useTranslations("Common.button");

  const { data, isLoading } = useGetBiometricByIdQuery({ id: params.id });

  if (isLoading) {
    return <BiometricsLoading />;
  }

  if (!data) {
    return notFound();
  }

  return (
    <div className="flex h-full min-h-[90dvh] gap-6 p-4">
      <div className="flex w-full max-w-96 flex-col gap-8 max-lg:hidden">
        <Button className="self-start" disabled={isLoading} asChild>
          <Link href="/dashboard/biometrics">
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
              <Fingerprint className="mr-1 shrink-0" />
              <span className="truncate">{data.id.slice(-8)}</span>
            </Badge>
          </CardHeader>
        </Card>

        <Card className="h-full w-full bg-border px-2 py-4">
          <div className="sticky top-0">
            <MasonryRoot gap={16} columnWidth={350} linear>
              <MasonryItem>
                <BiometricIndividualCard biometric={data} />
              </MasonryItem>
              <MasonryItem>
                <BiometricStatusCard biometric={data} />
              </MasonryItem>
              <MasonryItem>
                <BiometricDangerZoneCard id={params.id} />
              </MasonryItem>
              <MasonryItem>
                <BiometricAddedCard biometric={data} />
              </MasonryItem>
              <MasonryItem>
                <BiometricAccessCard biometric={data} />
              </MasonryItem>
            </MasonryRoot>
          </div>
        </Card>

        <LogRecentActivitiesCard className="lg:hidden" id={params.id} />
      </div>
    </div>
  );
}
