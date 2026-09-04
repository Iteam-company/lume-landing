/* ============================================================
   FAQ — той самий список для секції на сайті та для розмітки
   FAQPage. Текст живе у content/dictionary; відповідь про ціни
   збирається з pricing.ts у заданій валюті, щоб не розʼїхатися
   із секцією «Вартість».
   ============================================================ */

import dict from "./content/dictionary";
import { formatMinutesAcc, formatPrice } from "./content/format";
import type { Currency } from "./location/types";
import {
  bestPerMinute,
  finalPrice,
  optionsFor,
  perMinute,
  TIERS,
} from "./pricing";

export type QA = { q: string; a: string };

/** «STORY — від X за 1 хвилину до Y за 5 хвилин, Z за хвилину; …». */
function priceAnswer(currency: Currency): string {
  const d = dict.faq;

  const lines = TIERS.map((tier) => {
    const options = optionsFor(tier, currency);
    const cheapest = options[0];
    const priciest = options[options.length - 1];

    const range =
      `${d.priceFrom} ${formatPrice(finalPrice(cheapest), currency)} ` +
      `${d.priceFor} ${formatMinutesAcc(cheapest.minutes)} ` +
      `${d.priceTo} ${formatPrice(finalPrice(priciest), currency)} ` +
      `${d.priceFor} ${formatMinutesAcc(priciest.minutes)}`;

    const rates = options.map(perMinute);
    const flat = rates.every((r) => r === rates[0]);
    const rate = flat
      ? `${formatPrice(rates[0], currency)} ${d.perMinuteWord}`
      : `${d.priceFrom} ${formatPrice(bestPerMinute(tier, currency), currency)} ${d.perMinuteWord}`;

    return `${tier.name} — ${range}, ${rate}`;
  });

  return lines.join("; ") + ".";
}

export function buildFaq(currency: Currency): QA[] {
  const d = dict.faq;
  return d.items
    // ЦІНИ ТИМЧАСОВО ПРИХОВАНІ: питання про вартість не показуємо. Повернути — прибрати filter.
    .filter((item) => !item.a.includes("{prices}"))
    .map((item) => ({
    q: item.q,
    a: item.a
      .replace("{prices}", priceAnswer(currency))
      .replace("{currencyNote}", d.currencyNote),
    }));
}
