/* ============================================================
   Location Observer — server-only рідер.

   Єдине місце в проєкті, де читається заголовок геолокації, який
   reverse proxy (nginx) Hosting Ukraine додає до кожного запиту:

       GeoIp-Country-Code: UA        (ISO 3166-1 alpha-2, MaxMind GeoLite)

   HTTP-заголовки регістронезалежні, тож читаємо як "geoip-country-code".

   ВАЖЛИВО: не викликайте getVisitorLocation() з app/page.tsx чи
   app/layout.tsx. Доступ до headers() робить маршрут динамічним, а
   головна сторінка має лишатися статичною. На етапі 1 єдиний споживач —
   діагностичний маршрут app/api/debug/location.
   ============================================================ */

import "server-only";
import { headers } from "next/headers";

import {
  fallbackVisitorLocation,
  normalizeCountry,
  toVisitorLocation,
} from "./markets";
import type { VisitorLocation } from "./types";

/** Заголовок від nginx Hosting Ukraine (MaxMind GeoLite). */
const GEO_HEADER = "geoip-country-code";

/** Dev-only заголовок для локальної підміни країни. */
const DEV_OVERRIDE_HEADER = "x-vl-country";

/**
 * Чи дозволено читати dev-override у цьому середовищі.
 *
 * Потрібні ОБИДВІ умови. У production повертає false за будь-яких
 * значень env, тож підмінити країну ззовні в проді неможливо.
 */
function devOverrideEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" && process.env.LOCATION_DEBUG === "1"
  );
}

/**
 * Визначає ринок / дефолтну мову / валюту відвідувача за IP-країною,
 * яку встановив reverse proxy хостингу.
 *
 * Пріоритет:
 *   1. dev-override — лише коли NODE_ENV !== "production" AND LOCATION_DEBUG=1;
 *   2. заголовок geoip-country-code від хостингу;
 *   3. fallback → international / en / USD.
 */
export async function getVisitorLocation(): Promise<VisitorLocation> {
  const headerList = await headers();

  if (devOverrideEnabled()) {
    const override = normalizeCountry(headerList.get(DEV_OVERRIDE_HEADER));
    if (override !== null) return toVisitorLocation(override, "dev-override");
  }

  const country = normalizeCountry(headerList.get(GEO_HEADER));
  if (country !== null) return toVisitorLocation(country, "geo-header");

  return fallbackVisitorLocation();
}

/**
 * Чи бачить застосунок сирий гео-заголовок від хостингу.
 *
 * Тільки для діагностики (app/api/debug/location). Повертаємо виключно
 * значення geoip-country-code — жодних інших заголовків запиту й жодного
 * IP тут не торкаємось.
 */
export async function readGeoHeader(): Promise<{
  headerSeen: boolean;
  headerRaw: string | null;
}> {
  const raw = (await headers()).get(GEO_HEADER);
  return { headerSeen: raw !== null, headerRaw: raw };
}
