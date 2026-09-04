/* ============================================================
   FAQ — той самий список для секції на сайті та для розмітки
   FAQPage. Тексти живуть у словниках; відповідь про ціни
   збирається з pricing.ts у валюті локалі, щоб не розʼїхатися
   із секцією «Вартість».
   ============================================================ */

import { localeToCurrency, type Locale } from "./i18n/config";
import { getDictionary } from "./i18n/dictionaries";
import { formatMinutesAcc, formatPrice } from "./i18n/format";
import {
  bestPerMinute,
  finalPrice,
  optionsFor,
  perMinute,
  TIERS,
} from "./pricing";

export type QA = { q: string; a: string };

/** «STORY — від X за 1 хвилину до Y за 5 хвилин, Z за хвилину; …». */
function priceAnswer(locale: Locale): string {
  const currency = localeToCurrency(locale);
  const d = getDictionary(locale).faq;

  const lines = TIERS.map((tier) => {
    const options = optionsFor(tier, currency);
    const cheapest = options[0];
    const priciest = options[options.length - 1];

    const range =
      `${d.priceFrom} ${formatPrice(finalPrice(cheapest), locale)} ` +
      `${d.priceFor} ${formatMinutesAcc(cheapest.minutes, locale)} ` +
      `${d.priceTo} ${formatPrice(finalPrice(priciest), locale)} ` +
      `${d.priceFor} ${formatMinutesAcc(priciest.minutes, locale)}`;

    const rates = options.map(perMinute);
    const flat = rates.every((r) => r === rates[0]);
    const rate = flat
      ? `${formatPrice(rates[0], locale)} ${d.perMinuteWord}`
      : `${d.priceFrom} ${formatPrice(bestPerMinute(tier, currency), locale)} ${d.perMinuteWord}`;

    return `${tier.name} — ${range}, ${rate}`;
  });

  return lines.join("; ") + ".";
}

export function buildFaq(locale: Locale): QA[] {
  const d = getDictionary(locale).faq;
  return d.items
    // ЦІНИ ТИМЧАСОВО ПРИХОВАНІ: питання про вартість не показуємо. Повернути — прибрати filter.
    .filter((item) => !item.a.includes("{prices}"))
    .map((item) => ({
    q: item.q,
    a: item.a
      .replace("{prices}", priceAnswer(locale))
      .replace("{currencyNote}", d.currencyNote),
    }));
}
