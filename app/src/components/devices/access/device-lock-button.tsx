"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useAccessStateLockMutation } from "@/hooks/api/access/state/use-access-state-lock-mutation";
import { type DeviceResponse } from "@/lib/validations/device";
import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { toast } from "sonner";

interface DeviceLockButtonProps extends ButtonProps {
  device: DeviceResponse;
}

const DeviceLockButton = React.forwardRef<
  HTMLButtonElement,
  DeviceLockButtonProps
>(({ className, device, ...props }, ref) => {
  const t = useTranslations("Device.lock");

  const { mutateAsync: lock } = useAccessStateLockMutation({
    id: device.id,
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = () => {
    setIsLoading(true);

    const toastId = toast.loading(t("notification.loading"));

    lock()
      .then(() => {
        toast.success(t("notification.success"), {
          id: toastId,
        });
      })
      .catch(() => {
        toast.error(t("notification.error"), {
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
      <span>{t("button")}</span>
    </Button>
  );
});
DeviceLockButton.displayName = "DeviceLockButton";

export { DeviceLockButton };
