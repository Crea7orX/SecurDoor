"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useGetEmergencyCountQuery } from "@/hooks/api/emergency/use-get-emergency-count-query";
import { cn } from "@/lib/utils";
import { Microchip, Siren } from "lucide-react";
import * as React from "react";

interface DeviceEmergencyCountAlertProps
  extends React.ComponentPropsWithoutRef<typeof Alert> {
  onViewClick: () => void;
}

const DeviceEmergencyCountAlert = React.forwardRef<
  HTMLDivElement,
  DeviceEmergencyCountAlertProps
>(({ className, onViewClick, ...props }, ref) => {
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
          Warning!
        </AlertTitle>
        <AlertDescription>
          You have <b>{data.lockdownCount}</b> devices in <b>LOCKDOWN</b> mode
          and <b>{data.evacuationCount}</b> devices in <b>EVACUATION</b> mode.
        </AlertDescription>
      </div>
      <Button onClick={onViewClick}>
        <Microchip className="size-4" />
        View Devices
      </Button>
    </Alert>
  );
});
DeviceEmergencyCountAlert.displayName = "DeviceEmergencyCountAlert";

export { DeviceEmergencyCountAlert };
