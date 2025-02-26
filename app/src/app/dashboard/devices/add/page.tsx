"use client";

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
import { useCreateDeviceMutation } from "@/hooks/api/devices/use-create-device-mutation";
import { type DeviceWithSameSerialIdError } from "@/lib/exceptions";
import {
  type DeviceCreate,
  deviceCreateSchema,
} from "@/lib/validations/device";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function DevicesAddPage() {
  const t = useTranslations("Device");
  const tButton = useTranslations("Common.button");

  const router = useRouter();

  const { mutateAsync: add } = useCreateDeviceMutation();

  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<DeviceCreate>({
    resolver: zodResolver(deviceCreateSchema),
    defaultValues: {
      name: "",
      serialId: "",
    },
  });

  function onSubmit(data: DeviceCreate) {
    setIsLoading(true);
    const toastId = toast.loading(t("add.notification.loading"));

    add(data)
      .then((data) => {
        toast.success(t("add.notification.success"), {
          id: toastId,
        });

        router.push(`/dashboard/devices/${data.data.id}`);
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 409) {
            const responseData = error.response
              .data as DeviceWithSameSerialIdError;

            toast.error(t("add.notification.error_already_exists"), {
              id: toastId,
              ...(responseData.id && {
                action: (
                  <Button asChild>
                    <Link href={`/dashboard/devices/${responseData.id}`}>
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
        <Link href="/dashboard/devices">
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
                name="name"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("field.name.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("field.name.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("field.name.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serialId"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("field.serial_id.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("field.serial_id.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("field.serial_id.description")}
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
