import type { Metadata } from "next";
import { Abhaya_Libre, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import "./lume.css";
import MetaPixel from "./components/MetaPixel";
import { BRAND, DESCRIPTION, KEYWORDS, SITE_URL, TAGLINE } from "./site";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND} — ${TAGLINE.toLowerCase()}`,
    template: `%s — ${BRAND}`,
  },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: BRAND,
  category: "Подарунки та персональна анімація",
  alternates: {
    canonical: "/",
    languages: { "uk-UA": "/" },
  },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    siteName: BRAND,
    url: "/",
    title: `${BRAND} — ${TAGLINE.toLowerCase()}`,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND} — ${TAGLINE.toLowerCase()}`,
    description: DESCRIPTION,
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

export default function RootLayout({ children }: LayoutProps<"/">) {
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
