import { DeviceCardSkeleton } from "@/components/devices/device-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, SquareStack } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function DevicesLoading() {
  const t = useTranslations("Device");

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-1 sm:p-4">
      <div className="flex w-full items-center justify-between gap-2 overflow-auto p-1">
        <div className="flex flex-1 items-center gap-2">
          <Skeleton className="h-8 w-40 lg:w-64" />
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <SquareStack className="size-4" />
            {t("bulk.button")}
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/devices/add">
              <PlusCircle className="size-4" />
              {t("add.header")}
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-wrap items-center justify-center gap-12 rounded-lg border bg-muted/60 px-2 py-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <DeviceCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
