import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";

/* Сайт лише українською, без locale-префіксів у шляхах. */

const PAGES = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PAGES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
