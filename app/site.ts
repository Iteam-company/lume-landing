/* ============================================================
   Загальні дані про сайт — використовуються в метаданих,
   sitemap, robots і структурованій розмітці.

   Текст (title / description / keywords / міста) — в app/content/dictionary.
   Тут лише незмінні константи.
   ============================================================ */

/** Канонічна адреса сайту; NEXT_PUBLIC_SITE_URL дозволяє її перевизначити.
 *  Від неї залежать canonical, sitemap.xml, robots.txt і OpenGraph. */
const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = (
  RAW_SITE_URL && RAW_SITE_URL.length > 0 ? RAW_SITE_URL : "https://www.lume.kyiv.ua"
).replace(/\/$/, "");

export const BRAND = "LUME";

/** Логотип для структурованої розмітки (Organization.logo), 512×512. */
export const LOGO_PATH = "/logo.png";

/** Офіційні сторінки бренду: футер і Organization.sameAs у JSON-LD.
 *  Додавайте сюди нові (YouTube, TikTok, профіль Google) — розмітка підхопить. */
export const INSTAGRAM_URL = "https://www.instagram.com/lumestory.ua/";
export const SAME_AS = [INSTAGRAM_URL];
