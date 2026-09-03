import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";
import { DEFAULT_LOCALE, LOCALES } from "./i18n/config";

/* Індексовані URL — лише з префіксом локалі (/uk, /en …).
   Безпрефіксні шляхи роблять 307-redirect (proxy.ts) і в мапу не входять. */

type Entry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const PAGES: Entry[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PAGES.flatMap(({ path, changeFrequency, priority }) => {
    const languages = Object.fromEntries(
      LOCALES.map((locale) => [locale, `${SITE_URL}/${locale}${path}`]),
    );
    languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}${path}`;

    return LOCALES.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}
