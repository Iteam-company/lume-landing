import type { Metadata } from "next";
import LegalShell from "../../components/LegalShell";
import ru from "../../content/dictionary.ru";

export const metadata: Metadata = {
  title: ru.meta.termsTitle,
  description: ru.meta.termsDescription,
  alternates: {
    canonical: "/ru/terms",
    languages: { "uk-UA": "/terms", "en-US": "/en/terms", "ru-RU": "/ru/terms" },
  },
};

export default function TermsPage() {
  return <LegalShell dict={ru} doc={ru.legal.terms} lang="ru" />;
}
