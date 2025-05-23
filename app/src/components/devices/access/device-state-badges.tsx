import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type DeviceResponse } from "@/lib/validations/device";
import {
  BellElectric,
  Construction,
  DoorClosed,
  DoorClosedLocked,
  DoorOpen,
  Lock,
  LockOpen,
} from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

interface DeviceStateBadgesProps
  extends React.ComponentPropsWithoutRef<typeof Badge> {
  isLockedState: boolean;
  doorState: boolean | null;
  emergencyState: DeviceResponse["emergencyState"];
}

export function DeviceStateBadges({
  className,
  isLockedState,
  doorState,
  emergencyState,
  ...props
}: DeviceStateBadgesProps) {
  const t = useTranslations("Device.state");

  return (
    <>
      {isLockedState ? (
        <Badge className={className} {...props} variant="destructive">
          <Lock className="mr-1 size-4" />
          <span>{t("state.locked")}</span>
        </Badge>
      ) : (
        <Badge className={className} {...props} variant="success">
          <LockOpen className="mr-1 size-4" />
          <span>{t("state.unlocked")}</span>
        </Badge>
      )}
      {typeof doorState === "boolean" &&
        (doorState ? (
          <Badge className={className} {...props} variant="success">
            {emergencyState === "lockdown" ? (
              <DoorClosedLocked className="mr-1 size-4" />
            ) : (
              <DoorClosed className="mr-1 size-4" />
            )}

            <span>{t("state.closed")}</span>
          </Badge>
        ) : (
          <Badge className={className} {...props} variant="destructive">
            <DoorOpen className="mr-1 size-4" />
            <span>{t("state.open")}</span>
          </Badge>
        ))}
      {emergencyState === "lockdown" ? (
        <Badge
          className={cn("ring-4 ring-destructive/50", className)}
          {...props}
          variant="destructive"
        >
          <Construction className="mr-1 size-4" />
          <span>{t("emergency_state.lockdown")}</span>
        </Badge>
      ) : (
        emergencyState === "evacuation" && (
          <Badge
            className={cn("ring-4 ring-warning/50", className)}
            {...props}
            variant="warning"
          >
            <BellElectric className="mr-1 size-4" />
            <span>{t("emergency_state.evacuation")}</span>
          </Badge>
        )
      )}
    </>
  );
}
