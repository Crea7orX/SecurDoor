import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WebhookCreateDialog } from "@/components/webhooks/webhook-create-dialog";
import { WebhooksList } from "@/components/webhooks/webhooks-list";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

export function WebhooksCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  const t = useTranslations("Webhook.all_card");

  return (
    <Card className={cn("w-full bg-muted", className)} {...props}>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="px-0.5 pb-0.5">
        <Card>
          <CardContent className="flex flex-col gap-2 p-2">
            <WebhooksList />
            <WebhookCreateDialog>
              <Button variant="secondary" className="w-fit">
                <Plus />
                {t("button.create")}
              </Button>
            </WebhookCreateDialog>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
