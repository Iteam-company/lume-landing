import type { Metadata } from "next";
import LegalShell from "../../components/LegalShell";
import ru from "../../content/dictionary.ru";

/* Російська версія прихована: лишається за прямим посиланням, але в
   пошук не віддається (див. PUBLIC_LANGS у content/lang). */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: ru.meta.privacyTitle,
  description: ru.meta.privacyDescription,
  alternates: {
    canonical: "/ru/privacy",
  },
};

export default function PrivacyPage() {
  return <LegalShell dict={ru} doc={ru.legal.privacy} lang="ru" />;
}
