import type { Metadata } from "next";
import { languageAlternates } from "../../content/lang";
import LegalShell from "../../components/LegalShell";
import en from "../../content/dictionary.en";

export const metadata: Metadata = {
  title: en.meta.termsTitle,
  description: en.meta.termsDescription,
  alternates: {
    canonical: "/en/terms",
    languages: languageAlternates("/terms"),
  },
};

export default function TermsPage() {
  return <LegalShell dict={en} doc={en.legal.terms} lang="en" />;
}
