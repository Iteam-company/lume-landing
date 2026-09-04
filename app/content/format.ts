/* ============================================================
   Форматування контенту сайту — сайт лише українською, тож мова
   тут завжди uk-UA. Валюта — єдине, що лишається змінним: вона
   залежить від ринку відвідувача (Location Observer), не від мови.
   ============================================================ */

import type { Currency } from "../location/types";

const MONTHS = [
  "січня", "лютого", "березня", "квітня", "травня", "червня",
  "липня", "серпня", "вересня", "жовтня", "листопада", "грудня",
] as const;

/** Ціна у заданій валюті, без копійок: "3 800 ₴" / "$85". */
export function formatPrice(amount: number, currency: Currency): string {
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** «3 хвилини» — називний відмінок. */
export function formatMinutes(minutes: number): string {
  const word = minutes === 1 ? "хвилина" : minutes < 5 ? "хвилини" : "хвилин";
  return `${minutes} ${word}`;
}

/** «за 3 хвилини» — знахідний відмінок. */
export function formatMinutesAcc(minutes: number): string {
  const word = minutes === 1 ? "хвилину" : minutes < 5 ? "хвилини" : "хвилин";
  return `${minutes} ${word}`;
}

/** «30 вересня 2026». */
export function formatDateYmd(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
