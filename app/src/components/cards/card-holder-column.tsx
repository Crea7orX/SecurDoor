import { Badge } from "@/components/ui/badge";
import { ShieldQuestion } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

interface CardHolderColumnProps extends React.ComponentProps<"span"> {
  holder: string;
}

export function CardHolderColumn({
  className,
  holder,
  ...props
}: CardHolderColumnProps) {
  const t = useTranslations("Card");

  return holder ? (
    <span className={className} {...props}>
      {holder}
    </span>
  ) : (
    <Badge variant="warning" className="gap-1">
      <ShieldQuestion className="size-4 shrink-0" />
      <span className={className} {...props}>
        {t("field.holder.unknown")}
      </span>
    </Badge>
  );
}
