/* ============================================================
   i18n — базовий конфіг локалей.

   Етап 1: лише routing-фундамент. Тут немає словників і перекладів,
   лише перелік локалей, дефолт і зіставлення locale → currency
   (currency поки використовується тільки як конфіг: pricing.ts та
   відображення цін на цьому етапі не змінюються).
   ============================================================ */

export const LOCALES = ["uk", "en"] as const;

export type Locale = (typeof LOCALES)[number];

/** Локаль за замовчуванням: коли ні URL, ні cookie, ні Geo не дали відповіді. */
export const DEFAULT_LOCALE: Locale = "en";

export type Currency = "UAH" | "USD";

/** Валюта, закріплена за локаллю. Єдине джерело правди для майбутньої логіки цін. */
const LOCALE_CURRENCY: Record<Locale, Currency> = {
  uk: "UAH",
  en: "USD",
};

/** BCP-47 тег для Intl.* та атрибута <html lang> за потреби. */
const LOCALE_BCP47: Record<Locale, string> = {
  uk: "uk-UA",
  en: "en-US",
};

/** OpenGraph locale. */
const LOCALE_OG: Record<Locale, string> = {
  uk: "uk_UA",
  en: "en_US",
};

/** Чи є рядок однією з підтримуваних локалей. */
export function isLocale(value: string | null | undefined): value is Locale {
  return value != null && (LOCALES as readonly string[]).includes(value);
}

/** Валюта для локалі. */
export function localeToCurrency(locale: Locale): Currency {
  return LOCALE_CURRENCY[locale];
}

/** BCP-47 тег локалі, напр. "uk-UA". */
export function localeToBcp47(locale: Locale): string {
  return LOCALE_BCP47[locale];
}

/** OpenGraph locale, напр. "uk_UA". */
export function localeToOpenGraph(locale: Locale): string {
  return LOCALE_OG[locale];
}
