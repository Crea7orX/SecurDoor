"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useAccessStateLockMutation } from "@/hooks/api/access/state/use-access-state-lock-mutation";
import { type DeviceResponse } from "@/lib/validations/device";
import { Lock } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

interface DeviceLockButtonProps extends ButtonProps {
  device: DeviceResponse;
}

const DeviceLockButton = React.forwardRef<
  HTMLButtonElement,
  DeviceLockButtonProps
>(({ className, device, ...props }, ref) => {
  const { mutateAsync: lock } = useAccessStateLockMutation({
    id: device.id,
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = () => {
    setIsLoading(true);

    const toastId = toast.loading("Locking door...");

    lock()
      .then(() => {
        toast.success("Lock command sent!", {
          id: toastId,
        });
      })
      .catch(() => {
        toast.error("Failed to lock device!", {
          id: toastId,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Button
      variant="destructive"
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
      <Lock />
      <span>Lock</span>
    </Button>
  );
});
DeviceLockButton.displayName = "DeviceLockButton";

export { DeviceLockButton };
