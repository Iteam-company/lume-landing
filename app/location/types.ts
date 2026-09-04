/* ============================================================
   Location Observer — типи.

   Мова сайту завжди українська і від Geo не залежить. Location
   Observer тепер відповідає лише за одне: якою валютою показувати
   ціни (UAH для України, USD для решти світу).
   ============================================================ */

/** Нормалізований ISO 3166-1 alpha-2 код країни у верхньому регістрі, напр. "UA". */
export type CountryCode = string;

/** Ринок, до якого належить відвідувач. */
export type Market = "ukraine" | "international";

/** Валюта відображення цін для ринку. */
export type Currency = "UAH" | "USD";

/** Звідки взято країну — потрібно лише для діагностики. */
export type VisitorLocationSource = "geo-header" | "dev-override" | "fallback";

/** Результат роботи Location Observer. */
export type VisitorLocation = {
  /** Код країни або null, якщо визначити не вдалося. */
  country: CountryCode | null;
  market: Market;
  currency: Currency;
  source: VisitorLocationSource;
};
