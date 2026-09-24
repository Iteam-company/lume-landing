import type { Metadata } from "next";
import LegalShell from "../components/LegalShell";
import dict from "../content/dictionary";

export const metadata: Metadata = {
  title: dict.meta.privacyTitle,
  description: dict.meta.privacyDescription,
  alternates: {
    canonical: "/privacy",
    languages: {
      "uk-UA": "/privacy",
      "en-US": "/en/privacy",
      "ru-RU": "/ru/privacy",
    },
  },
};

export default function PrivacyPage() {
  return <LegalShell dict={dict} doc={dict.legal.privacy} lang="uk" />;
}
