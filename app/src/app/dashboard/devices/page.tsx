"use client";

import {
  DeviceCard,
  DeviceCardSkeleton,
} from "@/components/devices/device-card";
import { Button } from "@/components/ui/button";
import { useGetAllDevicesQuery } from "@/hooks/api/devices/use-get-all-devices-query";
import { PlusCircle } from "lucide-react";

export default function DevicesPage() {
  const { data, isLoading } = useGetAllDevicesQuery();

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
      <Button asChild>
        <a href="/dashboard/devices/add">
          <PlusCircle className="size-4" />
          Add Device
        </a>
      </Button>
      <div className="flex flex-wrap items-center justify-center gap-12">
        {isLoading &&
          Array.from({ length: 10 }).map((_, index) => (
            <DeviceCardSkeleton key={index} />
          ))}
        {data?.map((device, index) => (
          <DeviceCard device={device} key={index} index={index} />
        ))}
      </div>
    </div>
  );
}
