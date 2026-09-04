/* ============================================================
   Location Observer — server-only рідер.

   Застосунок задеплоєно на Vercel. Домен веде на Vercel напряму
   (Hosting Ukraine / adm.tools — лише DNS, не reverse proxy), тож
   країну визначає edge-мережа Vercel і додає до кожного запиту
   заголовок:

       x-vercel-ip-country: UA      (ISO 3166-1 alpha-2)

   Доступний і в Preview, і в Production. HTTP-заголовки
   регістронезалежні, читаємо як "x-vercel-ip-country".

   app/page.tsx викликає getVisitorLocation(), щоб вибрати валюту цін
   (UAH/USD) до першого рендеру — без цього довелося б визначати
   валюту на клієнті й ловити "флеш" USD → UAH. Доступ до headers()
   робить головну сторінку динамічною (SSR на кожен запит) — свідомий
   компроміс заради коректної валюти з першого байта. /privacy та
   /terms цей модуль не викликають і лишаються статичними.
   ============================================================ */

import "server-only";
import { headers } from "next/headers";

import {
  fallbackVisitorLocation,
  normalizeCountry,
  toVisitorLocation,
} from "./markets";
import type { VisitorLocation } from "./types";

/** Країна відвідувача від edge-мережі Vercel (Preview + Production). */
const GEO_HEADER = "x-vercel-ip-country";

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
 * Визначає ринок / валюту відвідувача за IP-країною,
 * яку встановила edge-мережа Vercel.
 *
 * Пріоритет:
 *   1. dev-override — лише коли NODE_ENV !== "production" AND LOCATION_DEBUG=1;
 *   2. заголовок x-vercel-ip-country від Vercel;
 *   3. fallback → international / USD.
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
 * Чи бачить застосунок сирий гео-заголовок від Vercel.
 *
 * Тільки для діагностики (app/api/debug/location). Повертаємо виключно
 * значення x-vercel-ip-country — жодних інших заголовків запиту й жодного
 * IP тут не торкаємось.
 */
export async function readGeoHeader(): Promise<{
  headerSeen: boolean;
  headerRaw: string | null;
}> {
  const raw = (await headers()).get(GEO_HEADER);
  return { headerSeen: raw !== null, headerRaw: raw };
}
