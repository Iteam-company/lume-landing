import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Abhaya_Libre, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import "./lume.css";
import MetaPixel from "./components/MetaPixel";
import { BRAND, SITE_URL } from "./site";
import dict from "./content/dictionary";

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

/* Сайт лише українською — жодного альтернативного hreflang. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: dict.meta.title,
    template: `%s — ${BRAND}`,
  },
  description: dict.meta.description,
  keywords: dict.meta.keywords,
  applicationName: BRAND,
  category: dict.meta.category,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    siteName: BRAND,
    url: "/",
    title: dict.meta.title,
    description: dict.meta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: dict.meta.title,
    description: dict.meta.description,
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="uk"
      className={`${sans.variable} ${cormorant.variable} ${abhaya.variable}`}
    >
      <body>
        {children}
        <MetaPixel />
      </body>
    </html>
  );
}
