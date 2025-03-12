"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { demo } from "@/config/demo";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { Play, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import * as React from "react";

const DemoAlert = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Alert>
>(({ className, ...props }, ref) => {
  const t = useTranslations("Dashboard.demo.alert");

  const user = useAuth();

  if (!demo.demoUserIds.includes(user.userId ?? "")) {
    return null;
  }

  return (
    <Alert
      className={cn(
        "flex items-center justify-between gap-6 max-sm:flex-col",
        className,
      )}
      ref={ref}
      variant="destructive"
      {...props}
    >
      <div>
        <AlertTitle className="inline-flex items-center text-lg font-extrabold">
          <TriangleAlert className="mr-1 size-6" />
          {t("title")}
        </AlertTitle>
        <AlertDescription className="font-bold">
          {t("description")}
        </AlertDescription>
      </div>
      <Button className="max-sm:self-end" asChild>
        <Link href="/dashboard/demo">
          <Play className="size-4" />
          {t("view")}
        </Link>
      </Button>
    </Alert>
  );
});
DemoAlert.displayName = "DemoAlert";

export { DemoAlert };
