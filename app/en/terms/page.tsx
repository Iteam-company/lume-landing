import type { Metadata } from "next";
import LegalShell from "../../components/LegalShell";
import en from "../../content/dictionary.en";

export const metadata: Metadata = {
  title: en.meta.termsTitle,
  description: en.meta.termsDescription,
  alternates: {
    canonical: "/en/terms",
    languages: {
      "uk-UA": "/terms",
      "en-US": "/en/terms",
      "x-default": "/terms",
    },
  },
};

export default function TermsPage() {
  return <LegalShell dict={en} doc={en.legal.terms} lang="en" />;
}
