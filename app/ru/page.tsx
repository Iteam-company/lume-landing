import type { Metadata } from "next";
import Landing from "../components/Landing";
import ru from "../content/dictionary.ru";

export const metadata: Metadata = {
  // шаблон layout додає "— LUME", а в заголовку бренд уже є
  title: { absolute: ru.meta.title },
  description: ru.meta.description,
  keywords: ru.meta.keywords,
  alternates: {
    canonical: "/ru",
    languages: {
      "uk-UA": "/",
      "en-US": "/en",
      "ru-RU": "/ru",
      "x-default": "/",
    },
  },
  openGraph: {
    locale: "ru_RU",
    url: "/ru",
    title: ru.meta.title,
    description: ru.meta.description,
  },
};

export default function RussianHome() {
  return <Landing lang="ru" />;
}
