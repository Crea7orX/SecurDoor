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
import { useCreateTagMutation } from "@/hooks/api/tags/use-create-tag-mutation";
import { useI18nZodErrors } from "@/hooks/use-i18n-zod-errors";
import { type TagCreate, tagCreateSchema } from "@/lib/validations/tag";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function TagCreateDialog({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Dialog>) {
  const t = useTranslations("Tag");
  const tButton = useTranslations("Common.button");

  const [isOpen, setIsOpen] = React.useState(false);

  const { mutateAsync: create } = useCreateTagMutation();
  const [isLoading, setIsLoading] = React.useState(false);

  useI18nZodErrors();
  const form = useForm<TagCreate>({
    resolver: zodResolver(tagCreateSchema),
    defaultValues: {
      name: "",
    },
    disabled: isLoading,
  });

  const onSubmit = async (data: TagCreate) => {
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
      .catch(() => {
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
                      maxLength={tagCreateSchema.shape.name.maxLength!}
                      {...field}
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
