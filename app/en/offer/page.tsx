import type { Metadata } from "next";
import LegalShell from "../../components/LegalShell";
import en from "../../content/dictionary.en";
import offer from "../../content/offer";

export const metadata: Metadata = {
  title: en.meta.offerTitle,
  description: en.meta.offerDescription,
  alternates: {
    canonical: "/en/offer",
    languages: { "uk-UA": "/offer", "en-US": "/en/offer", "x-default": "/offer" },
  },
};

/* Текст договору лишається українським — це його чинна мова. */
export default function OfferPage() {
  return <LegalShell dict={en} doc={offer} lang="en" showContacts={false} />;
}
