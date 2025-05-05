"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { InputInline } from "@/components/ui/input-inline";
import { useUpdateBiometricMutation } from "@/hooks/api/biometrics/use-update-biometric-mutation";
import { useI18nZodErrors } from "@/hooks/use-i18n-zod-errors";
import {
  biometricUpdateSchema,
  type BiometricResponse,
  type BiometricUpdate,
} from "@/lib/validations/biometric";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface BiometricIndividualCardProps
  extends React.ComponentProps<typeof Card> {
  biometric: BiometricResponse;
}

export function BiometricIndividualCard({
  className,
  biometric,
  ...props
}: BiometricIndividualCardProps) {
  const t = useTranslations("Biometric");

  const { mutateAsync: update } = useUpdateBiometricMutation({
    id: biometric.id,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  useI18nZodErrors();
  const form = useForm<BiometricUpdate>({
    resolver: zodResolver(biometricUpdateSchema),
    defaultValues: {
      individual: biometric.individual ?? "",
    },
  });

  React.useEffect(() => {
    if (!biometric) return;
    form.setValue("individual", biometric.individual ?? "", {
      shouldValidate: true,
    });
  }, [form, biometric]);

  const resetForm = () => {
    form.setValue("individual", biometric.individual ?? "", {
      shouldValidate: true,
    });
  };

  const handleUpdate = async (value: string) => {
    if (
      value === biometric.individual ||
      (value === "" && !biometric.individual)
    )
      return;
    if (!form.formState.isValid) return resetForm();

    setIsLoading(true);
    const toastId = toast.loading(t("individual.notification.loading"));
    await update({
      individual: value,
    })
      .then(() => {
        toast.success(t("individual.notification.success"), {
          id: toastId,
        });
      })
      .catch(() => {
        resetForm(); // Reset to original value

        toast.error(t("individual.notification.error"), {
          id: toastId,
        });
      });

    setIsLoading(false);
  };

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-1">
          <User className="size-6" />
          <span>{t("individual.title")}</span>
        </CardTitle>
        <CardDescription>{t("individual.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name="individual"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormControl>
                    <InputInline
                      className="bg-secondary text-secondary-foreground"
                      placeholder={
                        !biometric.individual
                          ? t("field.individual.unknown")
                          : t("field.individual.label")
                      }
                      disabled={isLoading}
                      onUpdate={handleUpdate}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
