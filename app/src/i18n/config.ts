export type Locale = (typeof locales)[number];

export const locales = ["en", "bg"] as const;
export const defaultLocale: Locale = "en";

export const namespaces = [
  "api-key",
  "card",
  "common",
  "dashboard",
  "data-table",
  "device",
  "landing",
  "log",
  "navigation",
  "tag",
  "webhook",
  "zod",
];
