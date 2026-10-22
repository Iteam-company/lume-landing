import type { Metadata } from "next";
import { languageAlternates } from "../../content/lang";
import LegalShell from "../../components/LegalShell";
import en from "../../content/dictionary.en";

export const metadata: Metadata = {
  title: en.meta.privacyTitle,
  description: en.meta.privacyDescription,
  alternates: {
    canonical: "/en/privacy",
    languages: languageAlternates("/privacy"),
  },
};

export default function PrivacyPage() {
  return <LegalShell dict={en} doc={en.legal.privacy} lang="en" />;
}
