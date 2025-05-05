"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useUpdateBiometricMutation } from "@/hooks/api/biometrics/use-update-biometric-mutation";
import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { toast } from "sonner";

interface BiometricActivateButtonProps extends ButtonProps {
  id: string;
}

export function BiometricActivateButton({
  className,
  id,
  ...props
}: BiometricActivateButtonProps) {
  const t = useTranslations("Biometric.status");

  const { mutateAsync: update } = useUpdateBiometricMutation({
    id,
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = () => {
    setIsLoading(true);

    const toastId = toast.loading(t("notification.activate.loading"));

    update({
      active: true,
    })
      .then(() => {
        toast.success(t("notification.activate.success"), {
          id: toastId,
        });
      })
      .catch(() => {
        toast.error(t("notification.activate.error"), {
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
      {...props}
      onClick={handleClick}
      disabled={isLoading || props.disabled}
    >
      <ShieldCheck />
      <span>{t("button.activate")}</span>
    </Button>
  );
}
