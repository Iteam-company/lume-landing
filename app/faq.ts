/* ============================================================
   FAQ — той самий список для секції на сайті та для розмітки
   FAQPage. Текст живе у content/dictionary; відповідь про ціни
   збирається з pricing.ts у заданій валюті, щоб не розʼїхатися
   із секцією «Вартість».
   ============================================================ */

import { getDictionary } from "./content/dictionaries";
import type { Lang } from "./content/lang";
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
function priceAnswer(currency: Currency, lang: Lang): string {
  const d = getDictionary(lang).faq;

  const lines = TIERS.map((tier) => {
    const options = optionsFor(tier, currency);
    const cheapest = options[0];
    const priciest = options[options.length - 1];

    const range =
      `${d.priceFrom} ${formatPrice(finalPrice(cheapest), currency, lang)} ` +
      `${d.priceFor} ${formatMinutesAcc(cheapest.minutes, lang)} ` +
      `${d.priceTo} ${formatPrice(finalPrice(priciest), currency, lang)} ` +
      `${d.priceFor} ${formatMinutesAcc(priciest.minutes, lang)}`;

    const rates = options.map(perMinute);
    const flat = rates.every((r) => r === rates[0]);
    const rate = flat
      ? `${formatPrice(rates[0], currency, lang)} ${d.perMinuteWord}`
      : `${d.priceFrom} ${formatPrice(bestPerMinute(tier, currency), currency, lang)} ${d.perMinuteWord}`;

    return `${tier.name} — ${range}, ${rate}`;
  });

  return lines.join("; ") + ".";
}

export function buildFaq(currency: Currency, lang: Lang): QA[] {
  const d = getDictionary(lang).faq;
  return d.items.map((item) => ({
    q: item.q,
    a: item.a
      .replace("{prices}", priceAnswer(currency, lang))
      .replace("{currencyNote}", d.currencyNote[currency]),
  }));
}
