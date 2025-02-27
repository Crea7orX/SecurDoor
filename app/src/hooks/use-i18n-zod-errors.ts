import { makeZodI18nMap } from "@/lib/zod-error-map";
import { useTranslations } from "next-intl";
import { z } from "zod";

export const useI18nZodErrors = () => {
  const t = useTranslations("Zod");
  z.setErrorMap(makeZodI18nMap({ t }));
};
