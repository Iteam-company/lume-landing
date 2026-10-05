import type { Metadata } from "next";
import LegalShell from "../../components/LegalShell";
import ru from "../../content/dictionary.ru";

export const metadata: Metadata = {
  title: ru.meta.privacyTitle,
  description: ru.meta.privacyDescription,
  alternates: {
    canonical: "/ru/privacy",
    languages: {
      "uk-UA": "/privacy",
      "en-US": "/en/privacy",
      "ru-RU": "/ru/privacy",
      "x-default": "/privacy",
    },
  },
};

export default function PrivacyPage() {
  return <LegalShell dict={ru} doc={ru.legal.privacy} lang="ru" />;
}
