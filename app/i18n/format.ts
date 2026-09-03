/* ============================================================
   i18n — locale-aware форматування.

   Прибирає хардкод "$", "USD", "uk-UA" з UI/FAQ/розмітки.
   Валюта визначається лише локаллю (localeToCurrency).
   ============================================================ */

import { localeToBcp47, localeToCurrency, type Locale } from "./config";

const MONTHS: Record<Locale, readonly string[]> = {
  uk: [
    "січня", "лютого", "березня", "квітня", "травня", "червня",
    "липня", "серпня", "вересня", "жовтня", "листопада", "грудня",
  ],
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
};

/** Ціна у валюті локалі, без копійок: "3 800 ₴" (uk) / "$85" (en). */
export function formatPrice(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(localeToBcp47(locale), {
    style: "currency",
    currency: localeToCurrency(locale),
    maximumFractionDigits: 0,
  }).format(amount);
}

/** «3 хвилини» / «3 minutes» — називний відмінок. */
export function formatMinutes(minutes: number, locale: Locale): string {
  if (locale === "en") {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  }
  const word = minutes === 1 ? "хвилина" : minutes < 5 ? "хвилини" : "хвилин";
  return `${minutes} ${word}`;
}

/** «за 3 хвилини» / «for 3 minutes» — знахідний відмінок. */
export function formatMinutesAcc(minutes: number, locale: Locale): string {
  if (locale === "en") {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  }
  const word = minutes === 1 ? "хвилину" : minutes < 5 ? "хвилини" : "хвилин";
  return `${minutes} ${word}`;
}

/** «30 вересня 2026» / «30 September 2026». Без залежності від локалі середовища. */
export function formatDateYmd(ymd: string, locale: Locale): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return `${d} ${MONTHS[locale][m - 1]} ${y}`;
}
