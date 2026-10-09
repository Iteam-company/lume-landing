import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";
import { LANG_BCP47, langPath, PUBLIC_LANGS } from "./content/lang";
import { PHOTO_VIDEO_PATH } from "./content/ai-video-from-photos";
import { GUIDE_PATH } from "./content/cartoon-guide";

/* Публічні мови: українська в корені, англійська під /en. Кожна адреса
   посилається на свого двійника через hreflang. Прихованих мов
   (див. PUBLIC_LANGS) у карті немає. */

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
    const languages = Object.fromEntries(
      PUBLIC_LANGS.map((lang) => [LANG_BCP47[lang], `${SITE_URL}${langPath(path, lang)}`]),
    );

    return PUBLIC_LANGS.map((lang) => ({
      url: `${SITE_URL}${langPath(path, lang)}`,
      lastModified,
      changeFrequency,
      priority: lang === "uk" ? priority : Math.min(priority, TRANSLATION_PRIORITY),
      alternates: { languages },
    }));
  });
}
