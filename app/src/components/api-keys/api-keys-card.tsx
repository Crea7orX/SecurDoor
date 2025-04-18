import { ApiKeyCreateDialog } from "@/components/api-keys/api-key-create-dialog";
import { ApiKeysList } from "@/components/api-keys/api-keys-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

export function ApiKeysCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  const t = useTranslations("ApiKey.all_card");

  return (
    <Card className={cn("w-full bg-muted", className)} {...props}>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="px-0.5 pb-0.5">
        <Card>
          <CardContent className="flex flex-col gap-2 p-2">
            <ApiKeysList />
            <ApiKeyCreateDialog>
              <Button variant="secondary" className="w-fit">
                <Plus />
                {t("button.create")}
              </Button>
            </ApiKeyCreateDialog>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
