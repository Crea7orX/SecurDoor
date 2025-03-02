"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useGetEmergencyCountQuery } from "@/hooks/api/emergency/use-get-emergency-count-query";
import { cn } from "@/lib/utils";
import { Microchip, Siren } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

interface DeviceEmergencyCountAlertProps
  extends React.ComponentPropsWithoutRef<typeof Alert> {
  onViewClick: () => void;
}

const DeviceEmergencyCountAlert = React.forwardRef<
  HTMLDivElement,
  DeviceEmergencyCountAlertProps
>(({ className, onViewClick, ...props }, ref) => {
  const t = useTranslations("Device.emergency_count_alert");

  const { data } = useGetEmergencyCountQuery();

  if (!data || (data.lockdownCount === 0 && data.evacuationCount === 0)) {
    return null;
  }

  return (
    <Alert
      className={cn("flex items-center justify-between gap-2", className)}
      ref={ref}
      variant="warning"
      {...props}
    >
      <div>
        <AlertTitle className="inline-flex items-center text-lg">
          <Siren className="mr-1 size-6" />
          {t("title")}
        </AlertTitle>
        <AlertDescription>
          {t.rich("description", {
            lockdownCount: data.lockdownCount,
            evacuationCount: data.evacuationCount,
            b: (chunks) => <b>{chunks}</b>,
          })}
        </AlertDescription>
      </div>
      <Button className="max-sm:hidden" onClick={onViewClick}>
        <Microchip className="size-4" />
        {t("view")}
      </Button>
    </Alert>
  );
});
DeviceEmergencyCountAlert.displayName = "DeviceEmergencyCountAlert";

export { DeviceEmergencyCountAlert };
