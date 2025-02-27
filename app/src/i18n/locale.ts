"use server";

import { cookies } from "next/headers";
import { type Locale, defaultLocale } from "@/i18n/config";

const COOKIE_NAME = "__client_locale";

export async function getUserLocale() {
  return cookies().get(COOKIE_NAME)?.value ?? defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  cookies().set(COOKIE_NAME, locale, {
    maxAge: 365 * 24 * 60 * 60, // 1 year
    path: "/",
  });
}
