"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Locale, locales } from "@/i18n/config";
import { setUserLocale } from "@/i18n/locale";
import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";

const LanguageSwitcher = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    const t = useTranslations("Common.languages");

    const locale = useLocale();

    const changeLanguage = (language: Locale) => {
      void setUserLocale(language);
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={className}
            ref={ref}
            {...props}
          >
            <Globe className="size-8" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {locales.map((code) => (
            <DropdownMenuItem
              key={code}
              onClick={() => changeLanguage(code)}
              disabled={code === locale}
            >
              {t(code)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
);
LanguageSwitcher.displayName = "LanguageSwitcher";

export { LanguageSwitcher };
