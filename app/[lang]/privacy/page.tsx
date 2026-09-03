import type { Metadata } from "next";
import LegalShell from "../../components/LegalShell";
import { DEFAULT_LOCALE, isLocale, type Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const m = getDictionary(lang).meta;
  return {
    title: m.privacyTitle,
    description: m.privacyDescription,
    alternates: { canonical: `/${lang}/privacy` },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(lang);

  return <LegalShell lang={lang} dict={dict} doc={dict.legal.privacy} />;
}
