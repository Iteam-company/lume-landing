/* ============================================================
   Тарифи. Числова модель цін — єдине джерело правди.

   Кожен тариф має ставку за хвилину в кожній валюті:
     EUR — міжнародний ринок (Європа й решта світу);
     UAH — окремі ціни для України, задані під ринок, а НЕ конвертовані
           за курсом. Жодних FX-API і жодної конвертації в рантаймі:
           дві валюти живуть незалежно одна від одної.

   Ладдер і ціна за хвилину рахуються зі ставки автоматично.
   Акційних цін немає: сайт показує ті самі ціни, що менеджер називає
   в чаті, — без перекреслених сум, знижок і строків дії.
   Текст тарифів (tagline / features / badge) — у app/content/dictionary,
   тут лише числа й структура.
   ============================================================ */

import type { Currency } from "./location/types";

export type PlanOption = {
  minutes: number;
  price: number;
};

export type TierSlug = "story" | "signature" | "cinema";

export type Tier = {
  name: string;
  slug: TierSlug;
  /** Ставки за хвилину по валютах. */
  rates: Record<Currency, number>;
  /** Мінімальний хронометраж замовлення. За замовчуванням 1 хвилина. */
  minMinutes?: number;
  /** Який варіант показати одразу (індекс у options). 1 — це 2 хвилини:
   *  так ціну називає менеджер у чаті. */
  defaultOption?: number;
  featured?: boolean;
  /** Пісня вже входить у тариф і не продається окремо. */
  songIncluded?: boolean;
};

/** Доплата за пісню на замовлення. Ціни задані під ринок, не за курсом. */
export const SONG_PRICE: Record<Currency, number> = {
  UAH: 500,
  EUR: 25,
};

/** Скільки коштує пісня у валюті. */
export function songPrice(currency: Currency): number {
  return SONG_PRICE[currency];
}

/** Будує варіанти minMinutes..maxMinutes зі ставки за хвилину. */
function ladder(rate: number, minMinutes = 1, maxMinutes = 5): PlanOption[] {
  return Array.from({ length: maxMinutes - minMinutes + 1 }, (_, i) => {
    const minutes = minMinutes + i;
    return { minutes, price: rate * minutes };
  });
}

export const TIERS: Tier[] = [
  {
    name: "STORY",
    slug: "story",
    defaultOption: 1,
    rates: { EUR: 65, UAH: 2800 },
  },
  {
    name: "SIGNATURE",
    slug: "signature",
    defaultOption: 1,
    featured: true,
    rates: { EUR: 95, UAH: 4200 },
  },
  {
    name: "CINEMA",
    slug: "cinema",
    defaultOption: 1,
    // Пісня входить у тариф
    songIncluded: true,
    rates: { EUR: 160, UAH: 8400 },
  },
];

/** Варіанти хронометражу тарифу в заданій валюті. */
export function optionsFor(tier: Tier, currency: Currency): PlanOption[] {
  return ladder(tier.rates[currency], tier.minMinutes ?? 1);
}

/** Ціна, яку платить клієнт зараз. */
export function finalPrice(option: PlanOption): number {
  return option.price;
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
