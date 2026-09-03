/* ============================================================
   Proxy (у Next.js 16 — колишній middleware).

   Єдине завдання на цьому етапі: для безпрефіксних content-маршрутів
   (`/`, `/privacy`, `/terms`, …) визначити локаль і зробити 307-redirect
   на `/uk/...` або `/en/...`.

   Вибір локалі:
     1. cookie `lume_locale`, якщо валідна;
     2. інакше заголовок x-vercel-ip-country: "UA" → uk, решта → en;
     3. fallback → DEFAULT_LOCALE ("en").

   Шляхи, що вже починаються з /uk або /en, пропускаються без redirect.
   /api, /_next, /_vercel і будь-які файли з розширенням (sitemap.xml,
   robots.txt, favicon.ico, *.svg, …) виключені через matcher.
   ============================================================ */

import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_LOCALE, LOCALES, isLocale } from "./app/i18n/config";

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Уже локалізований шлях — пропускаємо як є (cookie тут не чіпаємо).
  const alreadyPrefixed = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (alreadyPrefixed) return NextResponse.next();

  // 1) cookie → 2) Geo → 3) fallback
  const cookieLocale = request.cookies.get("lume_locale")?.value;
  const geoCountry = request.headers.get("x-vercel-ip-country");
  const locale = isLocale(cookieLocale)
    ? cookieLocale
    : geoCountry === "UA"
      ? "uk"
      : DEFAULT_LOCALE;

  // clone() зберігає query-параметри; hash до сервера не доходить —
  // його відновлює браузер після redirect.
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: [
    /*
     * Усі шляхи, КРІМ:
     *  - /api/*          — API та route handlers
     *  - /_next/*        — внутрішні ресурси Next
     *  - /_vercel/*      — службові Vercel
     *  - будь-що з крапкою (sitemap.xml, robots.txt, favicon.ico, *.svg, …)
     */
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
