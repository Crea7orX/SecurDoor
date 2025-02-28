"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useUpdateCardMutation } from "@/hooks/api/cards/use-update-card-mutation";
import { OctagonMinus } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { toast } from "sonner";

interface CardDisableButtonProps extends ButtonProps {
  id: string;
}

const CardDisableButton = React.forwardRef<
  HTMLButtonElement,
  CardDisableButtonProps
>(({ className, id, ...props }, ref) => {
  const t = useTranslations("Card.status");

  const { mutateAsync: update } = useUpdateCardMutation({
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
      ref={ref}
      {...props}
      onClick={handleClick}
      disabled={isLoading || props.disabled}
    >
      <OctagonMinus />
      <span>{t("button.disable")}</span>
    </Button>
  );
});
CardDisableButton.displayName = "CardDisableButton";

export { CardDisableButton };
