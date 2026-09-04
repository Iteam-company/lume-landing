/* ============================================================
   Location Observer — публічний вхід.

   Примітка: цей модуль реекспортує get-visitor-location.ts, який
   позначений "server-only". Тож імпорт із app/location у клієнтському
   компоненті свідомо призведе до помилки збірки — так і має бути.
   ============================================================ */

export type {
  CountryCode,
  Currency,
  Market,
  VisitorLocation,
  VisitorLocationSource,
} from "./types";

export {
  FALLBACK_MARKET,
  fallbackVisitorLocation,
  normalizeCountry,
  resolveMarket,
  toVisitorLocation,
} from "./markets";

export { getVisitorLocation, readGeoHeader } from "./get-visitor-location";
