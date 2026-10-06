import type { Metadata } from "next";
import Landing from "../components/Landing";
import ru from "../content/dictionary.ru";

/* Російська версія прихована: лишається за прямим посиланням, але в
   пошук не віддається (див. PUBLIC_LANGS у content/lang). */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
  // шаблон layout додає "— LUME", а в заголовку бренд уже є
  title: { absolute: ru.meta.title },
  description: ru.meta.description,
  keywords: ru.meta.keywords,
  alternates: {
    canonical: "/ru",
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
