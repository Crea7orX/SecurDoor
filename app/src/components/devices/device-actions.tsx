"use client";

import { Button } from "@/components/ui/button";
import { useAccessStateLockMutation } from "@/hooks/api/access/state/use-access-state-lock-mutation";
import { useAccessStateUnlockMutation } from "@/hooks/api/access/state/use-access-state-unlock-mutation";
import { cn } from "@/lib/utils";
import { type DeviceResponse } from "@/lib/validations/device";
import { Lock, LockOpen, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

interface DeviceActionsProps extends React.ComponentProps<"div"> {
  device: DeviceResponse;
}

export function DeviceActions({
  className,
  device,
  ...props
}: DeviceActionsProps) {
  const t = useTranslations("Device");

  const { mutateAsync: lock } = useAccessStateLockMutation({
    id: device.id,
  });
  const { mutateAsync: unlock } = useAccessStateUnlockMutation({
    id: device.id,
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const handleStateUpdate = (action: "lock" | "unlock") => {
    setIsLoading(true);

    const toastId = toast.loading(t(`${action}.notification.loading`));

    const mutation = action === "lock" ? lock : unlock;
    mutation()
      .then(() => {
        toast.success(t(`${action}.notification.success`), {
          id: toastId,
        });
      })
      .catch(() => {
        toast.error(t(`${action}.notification.error`), {
          id: toastId,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div
      className={cn(
        "ml-auto w-fit whitespace-nowrap rounded-md border",
        className,
      )}
      {...props}
    >
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "rounded-r-none border-0 !text-destructive shadow-none",
          device.isLocked && "!text-success",
        )}
        disabled={isLoading || device.isLocked !== device.state?.isLockedState}
        onClick={() => handleStateUpdate(device.isLocked ? "unlock" : "lock")}
      >
        {device.isLocked ? <LockOpen /> : <Lock />}
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-l-none border-0 border-l shadow-none"
      >
        <Link href={`/dashboard/devices/${device.id}`}>
          <Settings />
        </Link>
      </Button>
    </div>
  );
}
