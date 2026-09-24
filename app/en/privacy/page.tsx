import type { Metadata } from "next";
import LegalShell from "../../components/LegalShell";
import en from "../../content/dictionary.en";

export const metadata: Metadata = {
  title: en.meta.privacyTitle,
  description: en.meta.privacyDescription,
  alternates: {
    canonical: "/en/privacy",
    languages: {
      "uk-UA": "/privacy",
      "en-US": "/en/privacy",
      "ru-RU": "/ru/privacy",
    },
  },
};

export default function PrivacyPage() {
  return <LegalShell dict={en} doc={en.legal.privacy} lang="en" />;
}
