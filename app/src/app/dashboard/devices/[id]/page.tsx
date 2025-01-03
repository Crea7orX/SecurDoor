"use client";

import DevicesLoading from "@/app/dashboard/devices/loading";
import { DeviceAccessCard } from "@/components/devices/device-access-card";
import { DeviceAddedCard } from "@/components/devices/device-added-card";
import { DeviceControlsCard } from "@/components/devices/device-controls-card";
import { DeviceDangerZoneCard } from "@/components/devices/device-danger-zone-card";
import { DeviceRecentActivitiesCard } from "@/components/devices/device-recent-activities-card";
import { DeviceStateCard } from "@/components/devices/device-state-card";
import { DeviceStatusCard } from "@/components/devices/device-status-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { useGetDeviceByIdQuery } from "@/hooks/api/devices/use-get-device-by-id-query";
import { ArrowLeft, Microchip } from "lucide-react";
import { notFound } from "next/navigation";
import * as React from "react";

interface DevicePageProps {
  params: { id: string };
}

export default function DevicePage({ params }: DevicePageProps) {
  const { data, isLoading } = useGetDeviceByIdQuery({ id: params.id });

  if (isLoading) {
    return <DevicesLoading />;
  }

  if (!data) {
    return notFound(); // todo: i18n 404 page
  }

  return (
    <div className="flex flex-1 gap-6 p-4">
      <div className="flex w-96 flex-col gap-8 max-lg:hidden">
        <Button className="self-start" disabled={isLoading} asChild>
          <a href="/dashboard/devices">
            <ArrowLeft className="size-4" />
            Go Back
          </a>
        </Button>
        <DeviceRecentActivitiesCard id={params.id} />
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <Card className="w-full bg-border">
          <CardHeader className="flex-row justify-center gap-2 space-y-0 p-2">
            <span className="text-2xl font-bold">Device</span>
            <Badge variant="secondary" className="text-lg font-bold">
              <Microchip className="mr-1" />
              {data.name}
            </Badge>
          </CardHeader>
        </Card>

        <Card className="h-full w-full bg-border px-2 py-4">
          <div className="grid h-fit w-full gap-4 2xl:grid-cols-2 min-[1920px]:grid-cols-3">
            <div className="grid gap-4">
              <DeviceControlsCard id={params.id} />
              <DeviceAddedCard id={params.id} />
            </div>
            <div className="grid gap-4">
              <DeviceStateCard id={params.id} />
              <DeviceAccessCard id={params.id} />
            </div>
            <div className="grid gap-4">
              <DeviceStatusCard id={params.id} />
              <DeviceDangerZoneCard id={params.id} />
            </div>
          </div>
        </Card>

        <DeviceRecentActivitiesCard className="lg:hidden" id={params.id} />
      </div>
    </div>
  );
}
