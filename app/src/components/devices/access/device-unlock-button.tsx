"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useAccessStateUnlockMutation } from "@/hooks/api/access/state/use-access-state-unlock-mutation";
import { type DeviceResponse } from "@/lib/validations/device";
import { LockOpen } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

interface DeviceUnlockButtonProps extends ButtonProps {
  device: DeviceResponse;
}

const DeviceUnlockButton = React.forwardRef<
  HTMLButtonElement,
  DeviceUnlockButtonProps
>(({ className, device, ...props }, ref) => {
  const { mutateAsync: unlock } = useAccessStateUnlockMutation({
    id: device.id,
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = () => {
    setIsLoading(true);

    const toastId = toast.loading("Unlocking door...");

    unlock()
      .then(() => {
        toast.success("Unlock command sent!", {
          id: toastId,
        });
      })
      .catch(() => {
        toast.error("Failed to unlock device!", {
          id: toastId,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Button
      variant="success"
      className={className}
      ref={ref}
      {...props}
      onClick={handleClick}
      disabled={
        isLoading ||
        device.isLocked !== device.state?.isLockedState ||
        props.disabled
      }
    >
      <LockOpen />
      <span>Unlock</span>
    </Button>
  );
});
DeviceUnlockButton.displayName = "DeviceUnlockButton";

export { DeviceUnlockButton };
