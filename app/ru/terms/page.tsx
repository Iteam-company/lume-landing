import type { Metadata } from "next";
import LegalShell from "../../components/LegalShell";
import ru from "../../content/dictionary.ru";
import { languageAlternates } from "../../content/lang";

export const metadata: Metadata = {
  title: ru.meta.termsTitle,
  description: ru.meta.termsDescription,
  alternates: {
    canonical: "/ru/terms",
    languages: languageAlternates("/terms"),
  },
};

export default function TermsPage() {
  return <LegalShell dict={ru} doc={ru.legal.terms} lang="ru" />;
}
