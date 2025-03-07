import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function NotFoundPage() {
  const t = useTranslations("Common.not_found");

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <Card className="min-w-[280px]">
        <CardHeader className="text-center">
          <CardTitle className="text-6xl font-bold">{t("title")}</CardTitle>
          <CardDescription className="text-3xl font-medium">
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button size="lg" asChild className="text-lg">
            <a href="/">{t("button")}</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
