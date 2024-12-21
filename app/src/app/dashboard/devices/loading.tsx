import { DeviceCardSkeleton } from "@/components/devices/device-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import * as React from "react";

export default function DevicesLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
      <Button asChild>
        <a href="/dashboard/devices/add">
          <PlusCircle className="size-4" />
          Add Device
        </a>
      </Button>
      <div className="flex flex-wrap items-center justify-center gap-12">
        {Array.from({ length: 10 }).map((_, index) => (
          <DeviceCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
