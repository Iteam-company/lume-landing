import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";
import { INDEXED_LANGS, langPath, languageAlternates } from "./content/lang";
import { PHOTO_VIDEO_PATH } from "./content/ai-video-from-photos";
import { GUIDE_PATH } from "./content/cartoon-guide";

/* Мови для пошуку (INDEXED_LANGS): українська в корені, англійська під
   /en, російська під /ru. Кожна адреса посилається на своїх двійників
   через hreflang. */

const PAGES = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: PHOTO_VIDEO_PATH, changeFrequency: "monthly", priority: 0.8 },
  { path: GUIDE_PATH, changeFrequency: "monthly", priority: 0.7 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
] as const;

/** Українська версія — основна, переклади трохи нижче. */
const TRANSLATION_PRIORITY = 0.8;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PAGES.flatMap(({ path, changeFrequency, priority }) => {
    const languages = languageAlternates(path, SITE_URL);

    return INDEXED_LANGS.map((lang) => ({
      url: `${SITE_URL}${langPath(path, lang)}`,
      lastModified,
      changeFrequency,
      priority: lang === "uk" ? priority : Math.min(priority, TRANSLATION_PRIORITY),
      alternates: { languages },
    }));
  });
}
