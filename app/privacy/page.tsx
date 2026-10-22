import type { Metadata } from "next";
import { languageAlternates } from "../content/lang";
import LegalShell from "../components/LegalShell";
import dict from "../content/dictionary";

export const metadata: Metadata = {
  title: dict.meta.privacyTitle,
  description: dict.meta.privacyDescription,
  alternates: {
    canonical: "/privacy",
    languages: languageAlternates("/privacy"),
  },
};

export default function PrivacyPage() {
  return <LegalShell dict={dict} doc={dict.legal.privacy} lang="uk" />;
}
