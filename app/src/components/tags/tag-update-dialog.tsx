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
import { useUpdateTagMutation } from "@/hooks/api/tags/use-update-tag-mutation";
import { useI18nZodErrors } from "@/hooks/use-i18n-zod-errors";
import { deviceUpdateSchema } from "@/lib/validations/device";
import {
  type TagResponse,
  type TagUpdate,
  tagUpdateSchema,
} from "@/lib/validations/tag";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface TagUpdateDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  tag: TagResponse;
}

export function TagUpdateDialog({
  children,
  tag,
  ...props
}: TagUpdateDialogProps) {
  const t = useTranslations("Tag");
  const tButton = useTranslations("Common.button");

  const [isOpen, setIsOpen] = React.useState(false);

  const { mutateAsync: update } = useUpdateTagMutation({
    id: tag.id,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  useI18nZodErrors();
  const form = useForm<TagUpdate>({
    resolver: zodResolver(deviceUpdateSchema),
    defaultValues: {
      name: tag.name,
    },
    disabled: isLoading,
  });

  // Set default values on tag update
  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    form.reset(
      {
        name: tag.name,
      },
      {
        keepValues: true,
      },
    );
  }, [tag]);

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
                      maxLength={tagUpdateSchema.shape.name.unwrap().maxLength!}
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
