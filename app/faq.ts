/* ============================================================
   FAQ — той самий список для секції на сайті та для розмітки
   FAQPage. Текст живе у content/dictionary; відповідь про ціни
   збирається з pricing.ts у заданій валюті, щоб не розʼїхатися
   із секцією «Вартість».
   ============================================================ */

import { getDictionary } from "./content/dictionaries";
import type { Lang } from "./content/lang";
import { formatMinutes, formatPrice } from "./content/format";
import type { Currency } from "./location/types";
import {
  finalPrice,
  optionsFor,
  perMinute,
  TIERS,
} from "./pricing";

export type QA = { q: string; a: string };

/** Хронометраж, за яким називаємо суму, — як менеджер у чаті. */
const QUOTE_MINUTES = 2;

/** «STORY — 2 800 ₴ за хвилину, 2 хвилини = 5 600 ₴; …». */
function priceAnswer(currency: Currency, lang: Lang): string {
  const d = getDictionary(lang).faq;

  const lines = TIERS.map((tier) => {
    const option = optionsFor(tier, currency).find((o) => o.minutes === QUOTE_MINUTES)!;
    return (
      `${tier.name} — ${formatPrice(perMinute(option), currency, lang)} ${d.perMinuteWord}, ` +
      `${formatMinutes(QUOTE_MINUTES, lang)} = ${formatPrice(finalPrice(option), currency, lang)}`
    );
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
