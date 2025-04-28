import { getLog } from "@/lib/logs";
import { type LogResponse } from "@/lib/validations/log";
import { getTranslations } from "next-intl/server";

const colors = {
  default: "2b2d42",
  destructive: "d90429",
  secondary: "8d99ae",
  success: "00b140",
  info: "00a3e0",
  warning: "f9c74f",
};

interface TriggerWebhookProps {
  url: string;
  logsData: LogResponse[];
}

export async function triggerDiscordWebhook({
  url,
  logsData,
}: TriggerWebhookProps) {
  const t = await getTranslations({ locale: "bg" });

  const embeds = [];
  for (const logData of logsData) {
    const log = getLog({ t, logData });
    embeds.push({
      title: t(log.title),
      description: log.text?.toString().replaceAll('"', "**"), // This is a workaround for bolded text, if user enters quotes in tag name for example, can break the message in Discord
      color: parseInt(colors[log.color], 16),
      footer: {},
    });
  }

  // Add footer to last embed
  if (embeds.length > 0) {
    embeds[embeds.length - 1]!.footer = {
      text: t("Log.webhook.footer"),
    };
  }

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "SecurDoor",
      embeds,
    }),
  });
}

export async function triggerSlackWebhook({
  url,
  logsData,
}: TriggerWebhookProps) {
  const t = await getTranslations({ locale: "bg" });

  const attachments = [];
  for (const logData of logsData) {
    const log = getLog({ t, logData });
    attachments.push({
      fallback: log.text?.toString().replaceAll('"', "*"),
      color: colors[log.color],
      fields: [
        {
          title: t(log.title),
          value: log.text?.toString().replaceAll('"', "*"),
          short: false,
        },
      ],
    });
  }

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "SecurDoor",
      attachments: [
        ...attachments,
        {
          fallback: t("Log.webhook.footer"),
          fields: [
            {
              value: t("Log.webhook.footer"),
              short: false,
            },
          ],
        },
      ],
    }),
  });
}
