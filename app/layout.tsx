import type { Metadata } from "next";
import { Jost, Roboto, Marck_Script, Playfair_Display } from "next/font/google";
import "./globals.css";
import "./lume.css";

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
  title: "LUME — мультфільм за вашою історією",
  description:
    "Подаруйте близькій людині персональний мультфільм за вашою історією. Виготовлення за 1 день. Для пар, батьків, дітей, друзів і близьких.",
  openGraph: {
    title: "LUME — мультфільм за вашою історією",
    description:
      "Персональний мультфільм за вашою історією. Термін виготовлення — 1 день.",
    type: "website",
    locale: "uk_UA",
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
