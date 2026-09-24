import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";
import { LANG_BCP47, LANGS, langPath } from "./content/lang";

/* Три мови: українська в корені, англійська під /en, російська під /ru.
   Кожна адреса посилається на своїх двійників через hreflang. */

const PAGES = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
] as const;

/** Українська версія — основна, переклади трохи нижче. */
const TRANSLATION_PRIORITY = 0.8;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PAGES.flatMap(({ path, changeFrequency, priority }) => {
    const languages = Object.fromEntries(
      LANGS.map((lang) => [LANG_BCP47[lang], `${SITE_URL}${langPath(path, lang)}`]),
    );

    return LANGS.map((lang) => ({
      url: `${SITE_URL}${langPath(path, lang)}`,
      lastModified,
      changeFrequency,
      priority: lang === "uk" ? priority : Math.min(priority, TRANSLATION_PRIORITY),
      alternates: { languages },
    }));
  });
}
