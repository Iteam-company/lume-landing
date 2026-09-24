/* ============================================================
   Форматування контенту сайту.

   Дві змінні: мова інтерфейсу (uk/en) і валюта цін (UAH/EUR).
   Вони незалежні — валюту дає Location Observer за країною, мову
   обирає відвідувач або та сама країна.
   ============================================================ */

import type { Currency } from "../location/types";
import { LANG_BCP47, type Lang } from "./lang";

const MONTHS: Record<Lang, readonly string[]> = {
  uk: [
    "січня", "лютого", "березня", "квітня", "травня", "червня",
    "липня", "серпня", "вересня", "жовтня", "листопада", "грудня",
  ],
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
  ru: [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ],
};

/** Українське й російське відмінювання слова «хвилина» збігаються за
 *  правилом: 1 → однина, 2-4 → множина родового однини, решта — родовий
 *  множини. Форми різні, правило одне. */
function slavicPlural(n: number, forms: [string, string, string]): string {
  const mod100 = n % 100;
  const mod10 = n % 10;
  if (mod100 >= 11 && mod100 <= 14) return forms[2];
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];
  return forms[2];
}

/** Ціна у заданій валюті, без копійок: "3 800 ₴" / "€85". */
export function formatPrice(
  amount: number,
  currency: Currency,
  lang: Lang,
): string {
  return new Intl.NumberFormat(LANG_BCP47[lang], {
    style: "currency",
    currency,
    // без цього uk-UA пише євро як "35 EUR" замість "35 €"
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** «3 хвилини» / «3 минуты» / "3 minutes" — називний відмінок. */
export function formatMinutes(minutes: number, lang: Lang): string {
  if (lang === "en") return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  const forms: [string, string, string] =
    lang === "ru"
      ? ["минута", "минуты", "минут"]
      : ["хвилина", "хвилини", "хвилин"];
  return `${minutes} ${slavicPlural(minutes, forms)}`;
}

/** «за 3 хвилини» / «за 3 минуты» / "for 3 minutes" — знахідний відмінок. */
export function formatMinutesAcc(minutes: number, lang: Lang): string {
  if (lang === "en") return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  const forms: [string, string, string] =
    lang === "ru"
      ? ["минуту", "минуты", "минут"]
      : ["хвилину", "хвилини", "хвилин"];
  return `${minutes} ${slavicPlural(minutes, forms)}`;
}

/** «30 вересня 2026» / «30 сентября 2026» / "September 30, 2026". */
export function formatDateYmd(ymd: string, lang: Lang): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const month = MONTHS[lang][m - 1];
  return lang === "en" ? `${month} ${d}, ${y}` : `${d} ${month} ${y}`;
}
