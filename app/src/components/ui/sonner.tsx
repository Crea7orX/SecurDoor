"use client";

import {
  CircleAlert,
  CircleCheck,
  Info,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      visibleToasts={6}
      position="top-center"
      closeButton
      offset="1rem"
      dir="auto"
      toastOptions={{
        classNames: {
          toast:
            "toast group group-[.toaster]:bg-background group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          content: "group-[.toast]:mr-auto",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:!bg-primary group-[.toast]:!text-primary-foreground group-[.toast]:!ml-0",
          cancelButton:
            "group-[.toast]:!bg-destructive group-[.toast]:!text-destructive-foreground group-[.toast]:!ml-0",
          closeButton:
            "group-[.toast]:bg-background group-[.toast]:text-card-foreground group-[.toast]:border-border group-data-[type=loading]:hidden",
          icon: "group-data-[type=success]:text-success group-data-[type=info]:text-info group-data-[type=warning]:text-warning group-data-[type=error]:text-destructive",
        },
        duration: 10000,
      }}
      pauseWhenPageIsHidden
      icons={{
        success: <CircleCheck size={20} />,
        info: <Info size={20} />,
        warning: <TriangleAlert size={20} />,
        error: <CircleAlert size={20} />,
        loading: <Loader2 size={20} className="animate-spin" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
