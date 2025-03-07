"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CheckCircle, LoaderCircle, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

const LandingContactForm = React.forwardRef<
  React.ElementRef<typeof Card>,
  React.ComponentProps<typeof Card>
>(({ className, ...props }, ref) => {
  const t = useTranslations("Landing.contact.form");

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <Card
        className={cn("w-full max-w-xl border shadow-md", className)}
        ref={ref}
        {...props}
      >
        <CardContent className="p-6">
          <div className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
            <CheckCircle className="size-16 text-success" />
            <h3 className="text-2xl font-bold">{t("success.title")}</h3>
            <p className="max-w-md text-muted-foreground">
              {t("success.description")}
            </p>
            <Button variant="outline" onClick={() => setIsSubmitted(false)}>
              {t("success.button")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn("w-full max-w-xl border shadow-md", className)}
      ref={ref}
      {...props}
    >
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t("field.name.label")}</Label>
            <Input
              id="name"
              name="name"
              placeholder={t("field.name.placeholder")}
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("field.email.label")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("field.email.placeholder")}
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">{t("field.subject.label")}</Label>
            <Input
              id="subject"
              name="subject"
              placeholder={t("field.subject.placeholder")}
              required
              value={formData.subject}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{t("field.message.label")}</Label>
            <Textarea
              id="message"
              name="message"
              placeholder={t("field.message.placeholder")}
              rows={5}
              required
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <Button
            type="submit"
            className={cn("w-full gap-2", isSubmitting && "opacity-80")}
            disabled={isSubmitting}
          >
            {t("button")}
            {isSubmitting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
});
LandingContactForm.displayName = "LandingContactForm";

export { LandingContactForm };
