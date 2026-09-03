/* ============================================================
   Location Observer — типи.

   Перший етап: лише визначення ДЕФОЛТНИХ locale / currency за країною
   відвідувача (IP-геолокація edge-мережі Vercel).

   i18n, маршрути /uk та /en, proxy.ts, перемикач мови, cookie та
   UAH-ціни — це окремі майбутні задачі. Тут їх немає.
   ============================================================ */

/** Нормалізований ISO 3166-1 alpha-2 код країни у верхньому регістрі, напр. "UA". */
export type CountryCode = string;

/** Ринок, до якого належить відвідувач. */
export type Market = "ukraine" | "international";

/** Мова інтерфейсу за замовчуванням для ринку. */
export type Locale = "uk" | "en";

/** Валюта відображення цін для ринку. */
export type Currency = "UAH" | "USD";

/** Звідки взято країну — потрібно лише для діагностики. */
export type VisitorLocationSource = "geo-header" | "dev-override" | "fallback";

/** Результат роботи Location Observer. */
export type VisitorLocation = {
  /** Код країни або null, якщо визначити не вдалося. */
  country: CountryCode | null;
  market: Market;
  /**
   * Саме ДЕФОЛТНА мова для цього ринку. Це не «поточна мова інтерфейсу»:
   * майбутній ручний вибір користувача матиме над нею пріоритет.
   */
  defaultLocale: Locale;
  currency: Currency;
  source: VisitorLocationSource;
};
