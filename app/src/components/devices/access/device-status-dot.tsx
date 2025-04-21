import { type DeviceStatusDisplayInfos } from "@/config/device-statuses";
import { cn } from "@/lib/utils";
import * as React from "react";

export const statusColorVariants = {
  pendingAdoption: "bg-warning ring-warning/50",
  adopting: "bg-info ring-info/50",
  online: "bg-success ring-success/50",
  offline: "bg-destructive ring-destructive/50",
};

function getStatusColor(
  lastSeenAt: number,
  status: keyof typeof DeviceStatusDisplayInfos,
  now: Date,
) {
  if (status === "pending_adoption") return statusColorVariants.pendingAdoption;

  if (status === "adopting") return statusColorVariants.adopting;

  if (now.getTime() - (lastSeenAt ?? 0) * 1000 < 15000)
    return statusColorVariants.online;

  return statusColorVariants.offline;
}

interface DeviceStatusDotProps extends React.ComponentProps<"div"> {
  lastSeenAt: number;
  status: keyof typeof DeviceStatusDisplayInfos;
  now: Date;
}

export function DeviceStatusDot({
  className,
  lastSeenAt,
  status,
  now,
  ...props
}: DeviceStatusDotProps) {
  return (
    <div
      className={cn(
        "size-4 rounded-full ring-4",
        getStatusColor(lastSeenAt, status, now),
        className,
      )}
      {...props}
    />
  );
}
