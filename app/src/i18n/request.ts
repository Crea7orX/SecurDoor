import { defaultLocale, namespaces } from "@/i18n/config";
import { getUserLocale } from "@/i18n/locale";
import { getRequestConfig } from "next-intl/server";
import deepmerge from "deepmerge";
import { type AbstractIntlMessages } from "next-intl";

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    messages: deepmerge(
      await getMessages(defaultLocale),
      await getMessages(locale),
    ) as AbstractIntlMessages,
  };
});

export async function getMessages(locale: string) {
  const messagesArray = await Promise.all(
    namespaces.map(async (namespace) => {
      const importedMessages = (await import(
        `../messages/${locale}/${namespace}.json`
      )) as { default: AbstractIntlMessages };

      return importedMessages.default;
    }),
  );

  return Object.assign({}, ...messagesArray) as AbstractIntlMessages;
}
