import type { Metadata } from "next";
import Landing from "../components/Landing";

/* Демо для клієнта: та сама сторінка, але з блоком «Цифри», який на
   основній поки прихований. Пошуку не віддаємо і в sitemap не додаємо. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
};

export default function DemoHome() {
  return <Landing lang="uk" demo />;
}
