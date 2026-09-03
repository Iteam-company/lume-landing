/* ============================================================
   i18n — locale-aware внутрішні посилання.

   localeHref(locale, path) додає префікс локалі до внутрішнього шляху.
   Query і hash у `path` зберігаються як є.

     localeHref("uk", "/")                         -> "/uk"
     localeHref("uk", "/#pricing")                 -> "/uk/#pricing"
     localeHref("en", "/privacy")                  -> "/en/privacy"
     localeHref("uk", "/?tier=cinema&minutes=3#form") -> "/uk/?tier=cinema&minutes=3#form"
   ============================================================ */

import type { Locale } from "./config";

export function localeHref(locale: Locale, path: string): string {
  if (!path.startsWith("/")) {
    // не-абсолютні (напр. "#form" чи "mailto:") лишаємо без змін
    return path;
  }
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}
