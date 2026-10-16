import type { Metadata } from "next";
import LegalShell from "../components/LegalShell";
import dict from "../content/dictionary";
import offer from "../content/offer";

export const metadata: Metadata = {
  title: dict.meta.offerTitle,
  description: dict.meta.offerDescription,
  alternates: {
    canonical: "/offer",
    languages: { "uk-UA": "/offer", "en-US": "/en/offer", "x-default": "/offer" },
  },
};

export default function OfferPage() {
  return <LegalShell dict={dict} doc={offer} lang="uk" showContacts={false} />;
}
