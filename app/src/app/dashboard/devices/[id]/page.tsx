"use client";

import DevicesLoading from "@/app/dashboard/devices/loading";
import { DeviceAccessCard } from "@/components/devices/device-access-card";
import { DeviceAddedCard } from "@/components/devices/device-added-card";
import { DeviceControlsCard } from "@/components/devices/device-controls-card";
import { DeviceDangerZoneCard } from "@/components/devices/device-danger-zone-card";
import { DeviceStateCard } from "@/components/devices/device-state-card";
import { DeviceStatusCard } from "@/components/devices/device-status-card";
import { DeviceTagsCard } from "@/components/devices/tags/device-tags-card";
import { LogRecentActivitiesCard } from "@/components/logs/log-recent-activities-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { MasonryItem, MasonryRoot } from "@/components/ui/masonry";
import { useGetDeviceByIdQuery } from "@/hooks/api/devices/use-get-device-by-id-query";
import { ArrowLeft, Microchip } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { notFound } from "next/navigation";

interface DevicePageProps {
  params: { id: string };
}

export default function DevicePage({ params }: DevicePageProps) {
  const t = useTranslations("Device");
  const tButton = useTranslations("Common.button");

  const { data, isLoading } = useGetDeviceByIdQuery({
    id: params.id,
    refetchInterval: 2500,
  });

  if (isLoading) {
    return <DevicesLoading />;
  }

  if (!data) {
    return notFound();
  }

  return (
    <div className="flex h-full min-h-dvh gap-6 p-4">
      <div className="flex w-full max-w-96 flex-col gap-8 max-lg:hidden">
        <Button className="self-start" disabled={isLoading} asChild>
          <Link href="/dashboard/devices">
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
              <Microchip className="mr-1 shrink-0" />
              <span className="truncate">{data.name}</span>
            </Badge>
          </CardHeader>
        </Card>

        <Card className="h-full w-full bg-border px-2 py-4">
          <div className="sticky top-0">
            <MasonryRoot
              gap={16}
              columnWidth={350}
              linear
              key={data.emergencyState} // todo: to force re-render (really bad, need to find a better way)
            >
              <MasonryItem>
                <DeviceControlsCard device={data} />
              </MasonryItem>
              <MasonryItem>
                <DeviceStateCard device={data} />
              </MasonryItem>
              <MasonryItem>
                <DeviceTagsCard id={params.id} />
              </MasonryItem>
              <MasonryItem>
                <DeviceAddedCard device={data} />
              </MasonryItem>
              <MasonryItem>
                <DeviceAccessCard id={params.id} />
              </MasonryItem>
              <MasonryItem>
                <DeviceStatusCard device={data} />
              </MasonryItem>
              <MasonryItem>
                <DeviceDangerZoneCard device={data} />
              </MasonryItem>
            </MasonryRoot>
          </div>
        </Card>

        <LogRecentActivitiesCard className="lg:hidden" id={params.id} />
      </div>
    </div>
  );
}
