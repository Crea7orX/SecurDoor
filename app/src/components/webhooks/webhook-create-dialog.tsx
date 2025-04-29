"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  MultiSelect,
  type MultiSelectOption,
} from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogDisplayInfos } from "@/config/logs";
import { useCreateWebhookMutation } from "@/hooks/api/webhooks/use-create-webhook-mutation";
import { useI18nZodErrors } from "@/hooks/use-i18n-zod-errors";
import {
  type WebhookCreate,
  webhookCreateSchema,
} from "@/lib/validations/webhook";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const actions = [
  {
    label: "Slack",
    value: "slack",
  },
  {
    label: "Discord",
    value: "discord",
  },
];

export function WebhookCreateDialog({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Dialog>) {
  const _t = useTranslations();
  const t = useTranslations("Webhook");
  const tButton = useTranslations("Common.button");

  const [isOpen, setIsOpen] = React.useState(false);

  const scopeOptions: MultiSelectOption[] = React.useMemo(() => {
    return Object.entries(LogDisplayInfos).map(([action, display]) => {
      return {
        label: _t(display.title),
        value: action,
        key: action,
      };
    });
  }, [_t]);

  const { mutateAsync: create } = useCreateWebhookMutation();
  const [isLoading, setIsLoading] = React.useState(false);

  useI18nZodErrors();
  const form = useForm<WebhookCreate>({
    resolver: zodResolver(webhookCreateSchema),
    defaultValues: {
      name: "",
      type: undefined,
      url: "",
      scope: [],
    },
    disabled: isLoading,
  });

  const onSubmit = async (data: WebhookCreate) => {
    setIsLoading(true);
    const toastId = toast.loading(t("add.notification.loading"));
    await create(data)
      .then(() => {
        toast.success(t("add.notification.success"), {
          id: toastId,
        });

        setIsOpen(false);
        form.reset();
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 409) {
            toast.error(t("add.notification.error_already_exists"), {
              id: toastId,
            });
            return;
          }
        }

        toast.error(t("add.notification.error"), {
          id: toastId,
        });
      });

    setIsLoading(false);
  };

  return (
    <Dialog {...props} open={isOpen} onOpenChange={setIsOpen}>
      <Form {...form}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{t("add.title")}</DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("field.name.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("field.name.placeholder")}
                      maxLength={webhookCreateSchema.shape.name.maxLength!}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("field.type.label")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    {...field}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("field.type.placeholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {actions.map((action) => (
                        <SelectItem key={action.value} value={action.value}>
                          {action.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("field.url.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/webhook"
                      maxLength={webhookCreateSchema.shape.url.maxLength!}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scope"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("field.scope.label")}</FormLabel>

                  <FormControl>
                    <MultiSelect
                      {...field}
                      options={scopeOptions}
                      value={scopeOptions.filter((option) =>
                        field.value.includes(option.key),
                      )}
                      onChange={(options) => {
                        field.onChange(options.map((option) => option.key));
                      }}
                      placeholder={t("field.scope.placeholder")}
                      heading={t("field.scope.label")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-y-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                {tButton("cancel")}
              </Button>
              <Button disabled={isLoading}>{tButton("submit")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
