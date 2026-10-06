import type { Metadata } from "next";
import LegalShell from "../../components/LegalShell";
import ru from "../../content/dictionary.ru";

/* Російська версія прихована: лишається за прямим посиланням, але в
   пошук не віддається (див. PUBLIC_LANGS у content/lang). */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: ru.meta.termsTitle,
  description: ru.meta.termsDescription,
  alternates: {
    canonical: "/ru/terms",
  },
};

export default function TermsPage() {
  return <LegalShell dict={ru} doc={ru.legal.terms} lang="ru" />;
}
