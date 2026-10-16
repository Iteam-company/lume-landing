import type { Metadata } from "next";
import LegalShell from "../../components/LegalShell";
import ru from "../../content/dictionary.ru";
import offer from "../../content/offer";

/* Російська версія прихована від пошуку (див. PUBLIC_LANGS). */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: ru.meta.offerTitle,
  description: ru.meta.offerDescription,
  alternates: { canonical: "/ru/offer" },
};

/* Текст договору лишається українським — це його чинна мова. */
export default function OfferPage() {
  return <LegalShell dict={ru} doc={offer} lang="ru" showContacts={false} />;
}
