/* ============================================================
   Тарифи. Числова модель цін — єдине джерело правди.

   Кожен тариф має ставку за хвилину в кожній валюті:
     EUR — міжнародний ринок (Європа й решта світу);
     UAH — окремі ціни для України, задані під ринок, а НЕ конвертовані
           за курсом. Жодних FX-API і жодної конвертації в рантаймі:
           дві валюти живуть незалежно одна від одної.

   Ладдер, знижка та ціна за хвилину рахуються з ставки автоматично.
   Текст тарифів (tagline / features / badge) — у app/content/dictionary,
   тут лише числа й структура.
   ============================================================ */

import type { Currency } from "./location/types";

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
  EUR: 25,
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
    defaultOption: 0,
    // EUR: 65 / звичайна 76 → знижка ~14%
    // UAH: 2800 / звичайна 3300 → знижка ~15%
    rates: {
      EUR: { rate: 65, regularRate: 76 },
      UAH: { rate: 2800, regularRate: 3300 },
    },
  },
  {
    name: "SIGNATURE",
    slug: "signature",
    defaultOption: 0,
    featured: true,
    // EUR: 95 / звичайна 112 → знижка ~15%
    // UAH: 4200 / звичайна 4900 → знижка ~14%
    rates: {
      EUR: { rate: 95, regularRate: 112 },
      UAH: { rate: 4200, regularRate: 4900 },
    },
  },
  {
    name: "CINEMA",
    slug: "cinema",
    defaultOption: 0,
    // Пісня входить у тариф
    songIncluded: true,
    // EUR: 160 / звичайна 192 → знижка ~17%
    // UAH: 7100 / звичайна 8500 → знижка ~16%
    rates: {
      EUR: { rate: 160, regularRate: 192 },
      UAH: { rate: 7100, regularRate: 8500 },
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
