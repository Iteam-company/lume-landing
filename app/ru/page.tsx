import type { Metadata } from "next";
import Landing from "../components/Landing";
import ru from "../content/dictionary.ru";
import { languageAlternates } from "../content/lang";
import { BRAND } from "../site";

/* Російська версія — для пошуку: індексується й стоїть у hreflang, але
   в перемикачі мов її немає (див. SWITCHER_LANGS у content/lang). */
export const metadata: Metadata = {
  // шаблон layout додає "— LUME", а в заголовку бренд уже є
  title: { absolute: ru.meta.title },
  description: ru.meta.description,
  keywords: ru.meta.keywords,
  alternates: { canonical: "/ru", languages: languageAlternates("/") },
  openGraph: {
    // openGraph замінює весь об'єкт layout, тому прев'ю задаємо явно.
    type: "website",
    siteName: BRAND,
    locale: "ru_RU",
    url: "/ru",
    title: ru.meta.title,
    description: ru.meta.description,
    images: [{
      url: "/video/hero-poster.jpg",
      width: 1920,
      height: 1080,
      alt: ru.meta.title,
    }],
  },
};

export default function RussianHome() {
  return <Landing lang="ru" />;
}
