/* ============================================================
   Діагностика Location Observer.

   Мета: пересвідчитися, що edge-мережа Vercel реально прокидає заголовок
   x-vercel-ip-country до Next.js-застосунку на Preview / Production.

   Доступ лише з правильним токеном (?token=<LOCATION_DEBUG_TOKEN>).
   Без токена, з невірним токеном або коли секрет не заданий у оточенні —
   маршрут відповідає 404, ніби його не існує.

   IP відвідувача тут не читається, не логується і не повертається.
   Маршрут не входить у sitemap і віддає X-Robots-Tag: noindex.

   Папка називається debug/ (без підкреслення): у App Router тека з
   префіксом "_" повністю виключається з маршрутизації.
   ============================================================ */

import { getVisitorLocation, readGeoHeader } from "../../../location";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function notFound(): Response {
  return new Response("Not found", {
    status: 404,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

export async function GET(request: Request): Promise<Response> {
  const secret = process.env.LOCATION_DEBUG_TOKEN;
  const provided = new URL(request.url).searchParams.get("token");

  if (!secret || provided !== secret) return notFound();

  const [location, geo] = await Promise.all([
    getVisitorLocation(),
    readGeoHeader(),
  ]);

  return Response.json(
    {
      headerSeen: geo.headerSeen,
      // Лише значення x-vercel-ip-country — інші заголовки запиту не віддаємо.
      headerRaw: geo.headerRaw,
      country: location.country,
      market: location.market,
      currency: location.currency,
      source: location.source,
    },
    {
      status: 200,
      headers: {
        "cache-control": "no-store",
        "x-robots-tag": "noindex, nofollow",
      },
    },
  );
}
