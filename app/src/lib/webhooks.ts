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

interface TriggerDiscordWebhookProps {
  logData: LogResponse;
}

export async function triggerDiscordWebhook({
  logData,
}: TriggerDiscordWebhookProps) {
  const t = await getTranslations({ locale: "bg" });
  const log = getLog({ t, logData });

  await fetch(
    "https://discord.com/api/webhooks/1111111111111111111/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "SecurDoor",
        embeds: [
          {
            title: t(log.title),
            description: log.text?.toString().replaceAll('"', "**"), // This is a workaround for bolded text, if user enters quotes in tag name for example, can break the message in Discord
            color: parseInt(colors[log.color], 16),
            footer: {
              text: `SecurDoor Logs - Official Integration\nFor more information visit your dashboard!`,
            },
          },
        ],
      }),
    },
  );
}

export async function triggerSlackWebhook({
  logData,
}: TriggerDiscordWebhookProps) {
  const t = await getTranslations({ locale: "bg" });
  const log = getLog({ t, logData });

  await fetch(
    "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXX",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "SecurDoor",
        attachments: [
          {
            fallback: log.text?.toString().replaceAll('"', "*"),
            color: colors[log.color],
            fields: [
              {
                title: t(log.title),
                value: log.text?.toString().replaceAll('"', "*"),
                short: false,
              },
            ],
          },

          {
            fallback:
              "SecurDoor Logs - Official Integration\nFor more information visit your dashboard!",
            fields: [
              {
                value:
                  "SecurDoor Logs - Official Integration\nFor more information visit your dashboard!",
                short: false,
              },
            ],
          },
        ],
      }),
    },
  );
}
