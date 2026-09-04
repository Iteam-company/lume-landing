/* ============================================================
   Загальні дані про сайт — використовуються в метаданих,
   sitemap, robots і структурованій розмітці.

   Текст (title / description / keywords / міста) — в app/content/dictionary.
   Тут лише незмінні константи.
   ============================================================ */

/** Бойова адреса сайту. Обовʼязково задайте NEXT_PUBLIC_SITE_URL перед деплоєм:
 *  від неї залежать canonical, sitemap.xml, robots.txt і OpenGraph. */
const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = (
  RAW_SITE_URL && RAW_SITE_URL.length > 0 ? RAW_SITE_URL : "http://localhost:3000"
).replace(/\/$/, "");

export const BRAND = "LUME";
