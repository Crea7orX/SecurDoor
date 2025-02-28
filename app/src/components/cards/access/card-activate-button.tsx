"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useUpdateCardMutation } from "@/hooks/api/cards/use-update-card-mutation";
import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { toast } from "sonner";

interface CardActivateButtonProps extends ButtonProps {
  id: string;
}

const CardActivateButton = React.forwardRef<
  HTMLButtonElement,
  CardActivateButtonProps
>(({ className, id, ...props }, ref) => {
  const t = useTranslations("Card.status");

  const { mutateAsync: update } = useUpdateCardMutation({
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
      ref={ref}
      {...props}
      onClick={handleClick}
      disabled={isLoading || props.disabled}
    >
      <ShieldCheck />
      <span>{t("button.activate")}</span>
    </Button>
  );
});
CardActivateButton.displayName = "CardActivateButton";

export { CardActivateButton };
