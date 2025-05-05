import { Badge } from "@/components/ui/badge";
import { ShieldQuestion } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

interface BiometricIndividualColumnProps extends React.ComponentProps<"span"> {
  individual: string;
}

export function BiometricIndividualColumn({
  className,
  individual,
  ...props
}: BiometricIndividualColumnProps) {
  const t = useTranslations("Biometric");

  return individual ? (
    <span className={className} {...props}>
      {individual}
    </span>
  ) : (
    <Badge variant="warning" className="gap-1">
      <ShieldQuestion className="size-4 shrink-0" />
      <span className={className} {...props}>
        {t("field.individual.unknown")}
      </span>
    </Badge>
  );
}
