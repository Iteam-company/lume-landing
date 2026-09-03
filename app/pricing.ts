/* ============================================================
   Тарифи. Числова модель цін — єдине джерело правди.

   Кожен тариф має ставку за хвилину в кожній валюті:
     USD — вихідні ціни (не змінюються);
     UAH — зафіксовані вручну (USD × ~44.59, ставку округлено до
           50 ₴). Це НЕ live-FX: жодних API курсу й жодної
           конвертації в рантаймі.

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

export type TierSlug = "story" | "signature" | "cinema" | "diamond";

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
  /** Який варіант показати одразу (індекс у options) */
  defaultOption?: number;
  featured?: boolean;
};

/** Будує варіанти 1..maxMinutes із ставки за хвилину. */
function ladder(rate: number, regularRate?: number, maxMinutes = 5): PlanOption[] {
  return Array.from({ length: maxMinutes }, (_, i) => {
    const minutes = i + 1;
    return regularRate
      ? { minutes, base: regularRate * minutes, sale: rate * minutes }
      : { minutes, base: rate * minutes };
  });
}

export const TIERS: Tier[] = [
  {
    name: "STORY",
    slug: "story",
    defaultOption: 0,
    // USD: 85 / звичайна 99 → знижка ~14%
    // UAH: 85×44.59≈3790 → 3800 ; 99×44.59≈4414 → 4400
    rates: {
      USD: { rate: 85, regularRate: 99 },
      UAH: { rate: 3800, regularRate: 4400 },
    },
  },
  {
    name: "SIGNATURE",
    slug: "signature",
    defaultOption: 0,
    featured: true,
    // USD: 120 / звичайна 141 → знижка ~15%
    // UAH: 120×44.59≈5351 → 5350 ; 141×44.59≈6287 → 6300
    rates: {
      USD: { rate: 120, regularRate: 141 },
      UAH: { rate: 5350, regularRate: 6300 },
    },
  },
  {
    name: "CINEMA",
    slug: "cinema",
    defaultOption: 0,
    // USD: 150 / звичайна 180 → знижка ~17%
    // UAH: 150×44.59≈6689 → 6700 ; 180×44.59≈8026 → 8050
    rates: {
      USD: { rate: 150, regularRate: 180 },
      UAH: { rate: 6700, regularRate: 8050 },
    },
  },
  {
    name: "DIAMOND",
    slug: "diamond",
    defaultOption: 0,
    // USD: 210, без акційної ціни
    // UAH: 210×44.59≈9364 → 9350
    rates: {
      USD: { rate: 210 },
      UAH: { rate: 9350 },
    },
  },
];

/** Варіанти хронометражу тарифу в заданій валюті. */
export function optionsFor(tier: Tier, currency: Currency): PlanOption[] {
  const { rate, regularRate } = tier.rates[currency];
  return ladder(rate, regularRate);
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
