/* ============================================================
   Тарифи. Числова модель цін — єдине джерело правди.

   Кожен тариф має ставку за хвилину в кожній валюті:
     USD — міжнародний ринок;
     UAH — окремі ціни для України, задані під ринок, а НЕ конвертовані
           за курсом. Жодних FX-API і жодної конвертації в рантаймі:
           дві валюти живуть незалежно одна від одної.

   Ладдер, знижка та ціна за хвилину рахуються з ставки автоматично.
   Текст тарифів (tagline / features / badge) — у словниках
   (app/i18n/dictionaries), тут лише числа й структура.
   ============================================================ */

import type { Currency } from "./i18n/config";

/** Доки діє стартова ціна. Формат YYYY-MM-DD. */
export const LAUNCH_UNTIL = "2026-09-30";

export type PlanOption = {
  minutes: number;
  base: number;
  sale?: number;
};

export type TierSlug = "story" | "signature" | "cinema";

/** Ставка за хвилину для однієї валюти. */
export type RateSet = {
  /** Ставка, яку клієнт платить зараз. */
  rate: number;
  /** Звичайна ставка до кінця акції. Без неї тариф безакційний
   *  (без перекресленої ціни й без строку дії). */
  regularRate?: number;
};

export type Tier = {
  name: string;
  slug: TierSlug;
  /** Ставки за хвилину по валютах. */
  rates: Record<Currency, RateSet>;
  /** Мінімальний хронометраж замовлення. За замовчуванням 1 хвилина. */
  minMinutes?: number;
  /** Який варіант показати одразу (індекс у options) */
  defaultOption?: number;
  featured?: boolean;
  /** Пісня вже входить у тариф і не продається окремо. */
  songIncluded?: boolean;
};

/** Доплата за пісню на замовлення. Ціни задані під ринок, не за курсом. */
export const SONG_PRICE: Record<Currency, number> = {
  UAH: 499,
  USD: 25,
};

/** Скільки коштує пісня у валюті. */
export function songPrice(currency: Currency): number {
  return SONG_PRICE[currency];
}

/** Будує варіанти minMinutes..maxMinutes із ставки за хвилину. */
function ladder(
  rate: number,
  regularRate?: number,
  minMinutes = 1,
  maxMinutes = 5,
): PlanOption[] {
  const count = maxMinutes - minMinutes + 1;
  return Array.from({ length: count }, (_, i) => {
    const minutes = minMinutes + i;
    return regularRate
      ? { minutes, base: regularRate * minutes, sale: rate * minutes }
      : { minutes, base: rate * minutes };
  });
}

export const TIERS: Tier[] = [
  {
    name: "STORY",
    slug: "story",
    // Замовлення приймаємо від двох хвилин
    minMinutes: 2,
    defaultOption: 0,
    // USD: 85 / звичайна 99 → знижка ~14%
    // UAH: 1499 / звичайна 3800 → знижка ~61%
    rates: {
      USD: { rate: 85, regularRate: 99 },
      UAH: { rate: 1499, regularRate: 3800 },
    },
  },
  {
    name: "SIGNATURE",
    slug: "signature",
    defaultOption: 0,
    featured: true,
    // USD: 120 / звичайна 141 → знижка ~15%
    // UAH: 2200 / звичайна 5350 → знижка ~59%
    rates: {
      USD: { rate: 120, regularRate: 141 },
      UAH: { rate: 2200, regularRate: 5350 },
    },
  },
  {
    name: "CINEMA",
    slug: "cinema",
    defaultOption: 0,
    // Пісня входить у тариф
    songIncluded: true,
    // USD: 150 / звичайна 180 → знижка ~17%
    // UAH: 3333 / звичайна 6700 → знижка ~50%
    rates: {
      USD: { rate: 150, regularRate: 180 },
      UAH: { rate: 3333, regularRate: 6700 },
    },
  },
];

/** Варіанти хронометражу тарифу в заданій валюті. */
export function optionsFor(tier: Tier, currency: Currency): PlanOption[] {
  const { rate, regularRate } = tier.rates[currency];
  return ladder(rate, regularRate, tier.minMinutes ?? 1);
}

/** Ціна, яку платить клієнт зараз. */
export function finalPrice(option: PlanOption): number {
  return option.sale ?? option.base;
}

/** Знижка у відсотках, округлена до цілого. Null, якщо знижки немає. */
export function discount(option: PlanOption): number | null {
  if (!option.sale || option.sale >= option.base) return null;
  return Math.round((1 - option.sale / option.base) * 100);
}

/** Скільки коштує одна хвилина за цим варіантом. */
export function perMinute(option: PlanOption): number {
  return Math.round(finalPrice(option) / option.minutes);
}

/**
 * Ціна тарифу за N хвилин у валюті. Це джерело для UI й для сервера
 * (/api/orders) — суму завжди рахуємо тут, не довіряючи клієнту.
 */
export function priceFor(
  tier: Tier,
  minutes: number,
  currency: Currency,
): number {
  const option = optionsFor(tier, currency).find((o) => o.minutes === minutes);
  return option ? finalPrice(option) : 0;
}

/** Найвигідніша ціна за хвилину в межах тарифу. */
export function bestPerMinute(tier: Tier, currency: Currency): number {
  return Math.min(...optionsFor(tier, currency).map(perMinute));
}

/** Усі варіанти всіх тарифів у валюті — для структурованої розмітки. */
export function allOptions(
  currency: Currency,
): { tier: Tier; option: PlanOption }[] {
  return TIERS.flatMap((tier) =>
    optionsFor(tier, currency).map((option) => ({ tier, option })),
  );
}
