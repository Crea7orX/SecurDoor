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
import { Switch } from "@/components/ui/switch";
import { LogDisplayInfos } from "@/config/logs";
import { useUpdateWebhookMutation } from "@/hooks/api/webhooks/use-update-webhook-mutation";
import { useI18nZodErrors } from "@/hooks/use-i18n-zod-errors";
import { type TagUpdate } from "@/lib/validations/tag";
import {
  type WebhookResponse,
  type WebhookUpdate,
  webhookUpdateSchema,
} from "@/lib/validations/webhook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface WebhookUpdateDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  webhook: WebhookResponse;
}

export function WebhookUpdateDialog({
  children,
  webhook,
  ...props
}: WebhookUpdateDialogProps) {
  const _t = useTranslations();
  const t = useTranslations("Webhook");
  const tButton = useTranslations("Common.button");

  const [isOpen, setIsOpen] = React.useState(false);

  const scopeOptions: MultiSelectOption[] = React.useMemo(() => {
    return Object.entries(LogDisplayInfos).map(([action, display]) => {
      return {
        label: _t(display.title),
        value: _t(display.title) + "-" + action,
        key: action,
      };
    });
  }, [_t]);

  const { mutateAsync: update } = useUpdateWebhookMutation({
    id: webhook.id,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  useI18nZodErrors();
  const form = useForm<WebhookUpdate>({
    resolver: zodResolver(webhookUpdateSchema),
    defaultValues: {
      name: webhook.name,
      scope: webhook.scope,
      enabled: webhook.enabled,
    },
    disabled: isLoading,
  });

  // Set default values on webhook update
  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    form.reset(
      {
        name: webhook.name,
        scope: webhook.scope,
        enabled: webhook.enabled,
      },
      {
        keepValues: true,
      },
    );
  }, [webhook]);

  const resetForm = () => {
    form.reset();
  };

  const onSubmit = async (data: TagUpdate) => {
    if (!form.formState.isDirty) return;

    // Filter only dirty fields
    const dirtyFields = form.formState.dirtyFields;
    const updatedData = Object.keys(dirtyFields).reduce((acc, key) => {
      if (dirtyFields[key as keyof TagUpdate]) {
        return { ...acc, [key]: data[key as keyof TagUpdate] };
      }
      return acc;
    }, {});

    setIsLoading(true);
    const toastId = toast.loading(t("edit.notification.loading"));
    await update(updatedData)
      .then(() => {
        toast.success(t("edit.notification.success"), {
          id: toastId,
        });

        setIsOpen(false);
      })
      .catch(() => {
        toast.error(t("edit.notification.error"), {
          id: toastId,
        });
      });

    setIsLoading(false);
  };

  return (
    <Dialog {...props} open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{t("edit.title")}</DialogTitle>
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
                      maxLength={
                        webhookUpdateSchema.shape.name.unwrap().maxLength!
                      }
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
                        (field.value ?? []).includes(option.key),
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
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel>{t("field.enabled.label")}</FormLabel>
                  <FormControl>
                    <Switch
                      className="-translate-y-1"
                      checked={field.value ?? true}
                      onCheckedChange={field.onChange}
                      disabled={field.disabled}
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
                onClick={resetForm}
                disabled={isLoading || !form.formState.isDirty}
              >
                {tButton("reset")}
              </Button>
              <Button disabled={isLoading || !form.formState.isDirty}>
                {tButton("save_changes")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
