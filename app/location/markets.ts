/* ============================================================
   Location Observer — чиста бізнес-логіка ринків.

   Тут НЕМАЄ жодного Next.js API (ні headers(), ні cookies()):
   усе в цьому файлі можна викликати й покривати тестами ізольовано.
   Рідер, що читає заголовок запиту, — окремо в get-visitor-location.ts.

   Бізнес-правило:
     UA                    → market "ukraine",      currency "UAH"
     будь-яка інша країна   → market "international", currency "USD"
     країну не визначено    → те саме, що "international"

   Мова сайту сюди не входить: сайт завжди українською, незалежно
   від ринку відвідувача.
   ============================================================ */

import type {
  CountryCode,
  Currency,
  Market,
  VisitorLocation,
  VisitorLocationSource,
} from "./types";

/** Ринок, який використовуємо, коли країну визначити не вдалося. */
export const FALLBACK_MARKET: Market = "international";

/** Країни, що належать до ринку "ukraine". Поки що лише Україна. */
const UKRAINE_COUNTRIES: ReadonlySet<CountryCode> = new Set<CountryCode>(["UA"]);

/** Валюта для кожного ринку. */
const MARKET_CURRENCY: Record<Market, Currency> = {
  ukraine: "UAH",
  international: "USD",
};

/** Рівно дві латинські літери. */
const ISO_ALPHA2 = /^[A-Z]{2}$/;

/**
 * Значення, які geo-провайдер (Vercel edge / MaxMind) повертає замість
 * реальної країни: анонімний проксі, Tor, супутниковий провайдер,
 * «інше», наднаціональні позначки. Для наших цілей — «країну не визначено».
 */
const NON_COUNTRY_CODES: ReadonlySet<string> = new Set([
  "XX", // невідомо
  "ZZ", // невідомо / user-assigned
  "O1", // Other Country
  "A1", // Anonymous Proxy
  "A2", // Satellite Provider
  "T1", // Vercel: Tor exit node
  "EU", // Європа — не країна
  "AP", // Asia/Pacific Region — не країна
]);

/**
 * Приводить сире значення заголовка до валідного коду країни або null.
 *
 * trim → uppercase → лише дві латинські літери → відкидання не-країнних кодів.
 * Будь-що інше (порожнє, "U", "USA", "1A", "!!", null, undefined) → null.
 */
export function normalizeCountry(
  raw: string | null | undefined,
): CountryCode | null {
  const code = (raw ?? "").trim().toUpperCase();
  if (!ISO_ALPHA2.test(code)) return null;
  if (NON_COUNTRY_CODES.has(code)) return null;
  return code;
}

/**
 * До якого ринку належить країна.
 * null (країну не визначено) → міжнародний ринок.
 */
export function resolveMarket(country: CountryCode | null): Market {
  if (country !== null && UKRAINE_COUNTRIES.has(country)) return "ukraine";
  return "international";
}

/**
 * Збирає повний VisitorLocation з уже нормалізованого коду країни
 * (або null) та джерела, з якого його отримано.
 */
export function toVisitorLocation(
  country: CountryCode | null,
  source: VisitorLocationSource,
): VisitorLocation {
  const market = resolveMarket(country);
  return {
    country,
    market,
    currency: MARKET_CURRENCY[market],
    source,
  };
}

/** Значення за замовчуванням, коли гео-даних немає взагалі. */
export function fallbackVisitorLocation(): VisitorLocation {
  return toVisitorLocation(null, "fallback");
}
