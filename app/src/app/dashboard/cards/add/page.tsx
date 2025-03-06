"use client";

import { CardAddSelectDialog } from "@/components/cards/add/card-add-select-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateCardMutation } from "@/hooks/api/cards/use-create-card-mutation";
import { useI18nZodErrors } from "@/hooks/use-i18n-zod-errors";
import { type CardWithSameFingerprintError } from "@/lib/exceptions";
import { type CardCreate, cardCreateSchema } from "@/lib/validations/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CardsAddPage() {
  const t = useTranslations("Card");
  const tButton = useTranslations("Common.button");

  const router = useRouter();

  const { mutateAsync: add } = useCreateCardMutation();

  const [isLoading, setIsLoading] = React.useState(false);

  useI18nZodErrors();
  const form = useForm<CardCreate>({
    resolver: zodResolver(cardCreateSchema),
    defaultValues: {
      fingerprint: "",
      holder: null,
    },
  });

  function onSubmit(data: CardCreate) {
    setIsLoading(true);
    const toastId = toast.loading(t("add.notification.loading"));

    add(data)
      .then((data) => {
        toast.success(t("add.notification.success"), {
          id: toastId,
        });

        router.push(`/dashboard/cards/${data.data.id}`);
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 409) {
            const responseData = error.response
              .data as CardWithSameFingerprintError;

            toast.error(t("add.notification.error_already_exists"), {
              id: toastId,
              ...(responseData.id && {
                action: (
                  <Button asChild>
                    <Link href={`/dashboard/cards/${responseData.id}`}>
                      {t("add.notification.view")}
                    </Link>
                  </Button>
                ),
              }),
            });
            return;
          }
        }

        toast.error(t("add.notification.error"), {
          id: toastId,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4">
      <Button className="md:self-start" disabled={isLoading} asChild>
        <Link href="/dashboard/cards">
          <ArrowLeft className="size-4" />
          {tButton("go_back")}
        </Link>
      </Button>
      <Card className="bg-border lg:min-w-[380px]">
        <CardHeader>
          <CardTitle>{t("add.header")}</CardTitle>
        </CardHeader>
        <CardContent className="rounded-xl bg-card pt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="holder"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("field.holder.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("field.holder.placeholder")}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("field.holder.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fingerprint"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("field.fingerprint.label")}</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2 max-sm:flex-col">
                        <Input
                          value={field.value}
                          className="cursor-not-allowed"
                        />
                        <CardAddSelectDialog {...field}>
                          <Button className="max-sm:w-full">
                            {t("field.fingerprint.button")}
                          </Button>
                        </CardAddSelectDialog>
                      </div>
                    </FormControl>
                    <FormDescription>
                      {t("field.fingerprint.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 max-sm:flex-col">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {tButton("submit")}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading}
                  onClick={() => form.reset()}
                >
                  {tButton("clear")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
