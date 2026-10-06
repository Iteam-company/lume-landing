import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Abhaya_Libre, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import "./lume.css";
import MetaPixel from "./components/MetaPixel";
import { headers } from "next/headers";
import { BRAND, SITE_URL } from "./site";
import { getDictionary } from "./content/dictionaries";
import {
  DEFAULT_LANG,
  isLang,
  LANG_HEADER,
  LANG_OG,
  langPath,
} from "./content/lang";

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

/**
 * Мову сторінки визначає proxy.ts і кладе в заголовок запиту: layout
 * не знає маршруту, а <html lang> та метадані мають збігатися з тим,
 * що бачить відвідувач. Через це layout рендериться на кожен запит.
 */
async function currentLang() {
  const value = (await headers()).get(LANG_HEADER);
  return isLang(value) ? value : DEFAULT_LANG;
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await currentLang();
  const dict = getDictionary(lang);
  const home = langPath("/", lang);

  return {
  metadataBase: new URL(SITE_URL),
  title: {
    default: dict.meta.title,
    template: `%s — ${BRAND}`,
  },
  description: dict.meta.description,
  keywords: dict.meta.keywords,
  applicationName: BRAND,
  category: dict.meta.category,
  // hreflang: обидві версії рівноправні, пошук сам покаже потрібну.
  alternates: {
    canonical: home,
    languages: {
      "uk-UA": "/",
      "en-US": "/en",
      // кого не впізнали за мовою — на українську версію
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: LANG_OG[lang],
    siteName: BRAND,
    url: home,
    title: dict.meta.title,
    description: dict.meta.description,
    // Прев'ю для месенджерів і соцмереж: без нього посилання, надіслане
    // в Telegram чи WhatsApp, показується голим текстом.
    images: [
      {
        url: "/video/hero-poster.jpg",
        width: 1920,
        height: 1080,
        alt: dict.meta.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: dict.meta.title,
    description: dict.meta.description,
    images: ["/video/hero-poster.jpg"],
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

export default async function RootLayout({ children }: { children: ReactNode }) {
  const lang = await currentLang();

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
