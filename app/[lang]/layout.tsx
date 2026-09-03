import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Abhaya_Libre, Cormorant_Garamond, Inter } from "next/font/google";
import "../globals.css";
import "../lume.css";
import MetaPixel from "../components/MetaPixel";
import { BRAND, SITE_URL } from "../site";
import {
  DEFAULT_LOCALE,
  LOCALES,
  isLocale,
  localeToOpenGraph,
  type Locale,
} from "../i18n/config";
import { getDictionary } from "../i18n/dictionaries";

/* Типографіка за брендбуком:
   - Abhaya Libre SemiBold — тільки wordmark LUME (кирилиці у шрифті немає);
   - Cormorant Garamond Bold Italic — короткі емоційні акценти;
   - нейтральний sans — функціональний шар: тексти, меню, форми, ціни. */

const abhaya = Abhaya_Libre({
  variable: "--font-abhaya",
  subsets: ["latin"],
  weight: "600",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["cyrillic", "latin"],
  weight: "700",
  style: "italic",
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["cyrillic", "latin"],
});

/* Обидві локалі пререндеряться статично; інші значення сегмента → 404. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const m = getDictionary(lang).meta;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: m.title,
      template: `%s — ${BRAND}`,
    },
    description: m.description,
    keywords: m.keywords,
    applicationName: BRAND,
    category: m.category,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        "uk-UA": "/uk",
        "en-US": "/en",
        "x-default": `/${DEFAULT_LOCALE}`,
      },
    },
    openGraph: {
      type: "website",
      locale: localeToOpenGraph(lang),
      siteName: BRAND,
      url: `/${lang}`,
      title: m.title,
      description: m.description,
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;

  return (
    <html
      lang={lang}
      className={`${sans.variable} ${cormorant.variable} ${abhaya.variable}`}
    >
      <body>
        {children}
        <MetaPixel />
      </body>
    </html>
  );
}
