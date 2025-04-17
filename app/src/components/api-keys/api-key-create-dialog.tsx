"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useCreateApiKeyMutation } from "@/hooks/api/api-keys/use-create-api-key-mutation";
import { useI18nZodErrors } from "@/hooks/use-i18n-zod-errors";
import {
  type ApiKeyCreate,
  apiKeyCreateSchema,
} from "@/lib/validations/api-key";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ApiKeyCreateDialog({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Dialog>) {
  const tButton = useTranslations("Common.button");

  const [isOpen, setIsOpen] = React.useState(false);

  const { mutateAsync: create } = useCreateApiKeyMutation();
  const [isLoading, setIsLoading] = React.useState(false);

  useI18nZodErrors();
  const form = useForm<ApiKeyCreate>({
    resolver: zodResolver(apiKeyCreateSchema),
    defaultValues: {
      name: "",
    },
    disabled: isLoading,
  });

  const onSubmit = async (data: ApiKeyCreate) => {
    setIsLoading(true);
    const toastId = toast.loading("Adding secret key...");
    await create(data)
      .then(() => {
        toast.success("Secret key added!", {
          id: toastId,
        });

        setIsOpen(false);
        form.reset();
      })
      .catch(() => {
        toast.error("Failed to add secret key!", {
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
              <DialogTitle>Add Secret Key</DialogTitle>
              <DialogDescription>
                Create a new secret key to securely manage your devices from
                third parties.
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
