import { Badge } from "@/components/ui/badge";
import { OctagonMinus, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

interface BiometricStatusBadgeProps extends React.ComponentProps<typeof Badge> {
  active: boolean;
}

export function BiometricStatusBadge({
  className,
  active,
  ...props
}: BiometricStatusBadgeProps) {
  const t = useTranslations("Biometric.status.state");

  return active ? (
    <Badge variant="success" className={className} {...props}>
      <ShieldCheck className="mr-1 size-4" />
      <span>{t("active")}</span>
    </Badge>
  ) : (
    <Badge variant="destructive" className={className} {...props}>
      <OctagonMinus className="mr-1 size-4" />
      <span>{t("disabled")}</span>
    </Badge>
  );
}
