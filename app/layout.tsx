import type { Metadata } from "next";
import { Jost, Roboto, Marck_Script, Playfair_Display } from "next/font/google";
import "./globals.css";
import "./lume.css";
import { BRAND, DESCRIPTION, KEYWORDS, SITE_URL, TAGLINE } from "./site";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "700", "900"],
});

const marck = Marck_Script({
  variable: "--font-marck",
  subsets: ["cyrillic", "latin"],
  weight: "400",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600"],
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
      className={`${jost.variable} ${roboto.variable} ${marck.variable} ${playfair.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
