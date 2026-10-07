import type { Metadata } from "next";
import Landing from "../components/Landing";
import en from "../content/dictionary.en";
import { BRAND } from "../site";

export const metadata: Metadata = {
  // шаблон layout додає "— LUME", а в заголовку бренд уже є
  title: { absolute: en.meta.title },
  description: en.meta.description,
  keywords: en.meta.keywords,
  alternates: { canonical: "/en", languages: {
      "uk-UA": "/",
      "en-US": "/en",
      "x-default": "/",
    } },
  openGraph: {
    // openGraph замінює весь об'єкт layout, тому прев'ю задаємо явно.
    type: "website",
    siteName: BRAND,
    locale: "en_US",
    url: "/en",
    title: en.meta.title,
    description: en.meta.description,
    images: [{
      url: "/video/hero-poster.jpg",
      width: 1920,
      height: 1080,
      alt: en.meta.title,
    }],
  },
};

export default function EnglishHome() {
  return <Landing lang="en" />;
}
