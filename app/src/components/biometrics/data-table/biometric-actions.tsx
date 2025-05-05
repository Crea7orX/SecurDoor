"use client";

import { Button } from "@/components/ui/button";
import { useUpdateBiometricMutation } from "@/hooks/api/biometrics/use-update-biometric-mutation";
import { cn } from "@/lib/utils";
import type { BiometricResponse } from "@/lib/validations/biometric";
import { OctagonMinus, Settings, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

interface BiometricActionsProps extends React.ComponentProps<"div"> {
  biometric: BiometricResponse;
}

export function BiometricActions({
  className,
  biometric,
  ...props
}: BiometricActionsProps) {
  const t = useTranslations("Biometric.status.notification");

  const { mutateAsync: update } = useUpdateBiometricMutation({
    id: biometric.id,
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const handleStateUpdate = (action: "activate" | "disable") => {
    setIsLoading(true);

    const toastId = toast.loading(t(`${action}.loading`));

    update({
      active: action === "activate",
    })
      .then(() => {
        toast.success(t(`${action}.success`), {
          id: toastId,
        });
      })
      .catch(() => {
        toast.error(t(`${action}.error`), {
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
          "rounded-r-none border-0 !text-success shadow-none",
          biometric.active && "!text-destructive",
        )}
        disabled={isLoading}
        onClick={() =>
          handleStateUpdate(biometric.active ? "disable" : "activate")
        }
      >
        {biometric.active ? <OctagonMinus /> : <ShieldCheck />}
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-l-none border-0 border-l shadow-none"
        asChild
      >
        <Link href={`/dashboard/biometrics/${biometric.id}`}>
          <Settings />
        </Link>
      </Button>
    </div>
  );
}
