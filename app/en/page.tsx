import type { Metadata } from "next";
import Landing from "../components/Landing";
import en from "../content/dictionary.en";

export const metadata: Metadata = {
  // шаблон layout додає "— LUME", а в заголовку бренд уже є
  title: { absolute: en.meta.title },
  description: en.meta.description,
  keywords: en.meta.keywords,
  alternates: { canonical: "/en", languages: { "uk-UA": "/", "en-US": "/en", "ru-RU": "/ru" } },
  openGraph: {
    locale: "en_US",
    url: "/en",
    title: en.meta.title,
    description: en.meta.description,
  },
};

export default function EnglishHome() {
  return <Landing lang="en" />;
}
