import type { Metadata } from "next";
import LegalShell from "../components/LegalShell";
import dict from "../content/dictionary";

export const metadata: Metadata = {
  title: dict.meta.termsTitle,
  description: dict.meta.termsDescription,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalShell dict={dict} doc={dict.legal.terms} />;
}
