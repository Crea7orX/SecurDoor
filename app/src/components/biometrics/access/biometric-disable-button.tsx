"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useUpdateBiometricMutation } from "@/hooks/api/biometrics/use-update-biometric-mutation";
import { OctagonMinus } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { toast } from "sonner";

interface BiometricDisableButtonProps extends ButtonProps {
  id: string;
}

export function BiometricDisableButton({
  className,
  id,
  ...props
}: BiometricDisableButtonProps) {
  const t = useTranslations("Biometric.status");

  const { mutateAsync: update } = useUpdateBiometricMutation({
    id,
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = () => {
    setIsLoading(true);

    const toastId = toast.loading(t("notification.disable.loading"));

    update({
      active: false,
    })
      .then(() => {
        toast.warning(t("notification.disable.success"), {
          id: toastId,
        });
      })
      .catch(() => {
        toast.error(t("notification.disable.error"), {
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
      {...props}
      onClick={handleClick}
      disabled={isLoading || props.disabled}
    >
      <OctagonMinus />
      <span>{t("button.disable")}</span>
    </Button>
  );
}
