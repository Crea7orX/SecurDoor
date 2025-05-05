import { FormattedDate } from "@/components/data-table/formatted-date";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { BiometricResponse } from "@/lib/validations/biometric";
import { CalendarClock } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

interface BiometricAddedCardProps extends React.ComponentProps<typeof Card> {
  biometric: BiometricResponse;
}

export function BiometricAddedCard({
  className,
  biometric,
  ...props
}: BiometricAddedCardProps) {
  const t = useTranslations("Biometric.added");

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-1">
          <CalendarClock className="size-6" />
          <span>{t("title")}</span>
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="info" className="text-md">
          <CalendarClock className="mr-1 size-4" />
          <FormattedDate date={new Date(biometric.createdAt * 1000)} />
        </Badge>
      </CardContent>
    </Card>
  );
}
