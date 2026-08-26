import { FAQ } from "../faq";
import {
  ALL_OPTIONS,
  discount,
  finalPrice,
  LAUNCH_UNTIL,
  minutesLabel,
  perMinute,
} from "../pricing";
import { ORDER_EMAIL } from "../config";
import { BRAND, CITIES, DESCRIPTION, SITE_URL, TAGLINE } from "../site";

/* ============================================================
   Структурована розмітка (JSON-LD).
   Саме її читають Google, Bing та AI-асистенти, коли вирішують,
   що це за послуга, скільки коштує і кому підходить.
   Дані беруться з тих самих файлів, що й видима частина сайту,
   тому розмітка не розʼїжджається з цінами на сторінці.
   ============================================================ */

export default function StructuredData() {
  const offers = ALL_OPTIONS.map(({ tier, option }) => {
    const off = discount(option);
    return {
      "@type": "Offer",
      name: `${BRAND} ${tier.name} — мультфільм ${minutesLabel(option.minutes)}`,
      description:
        `Персональний мультфільм за вашою історією, хронометраж ${minutesLabel(option.minutes)}. ` +
        `Це ${perMinute(option)} доларів за хвилину.`,
      price: String(finalPrice(option)),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/#pricing`,
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        value: option.minutes,
        unitCode: "MIN",
        unitText: "хвилин мультфільму",
      },
      ...(option.sale ? { priceValidUntil: LAUNCH_UNTIL } : {}),
      ...(option.sale && off
        ? {
            priceSpecification: {
              "@type": "PriceSpecification",
              price: String(option.base),
              priceCurrency: "USD",
              valueAddedTaxIncluded: true,
            },
          }
        : {}),
    };
  });

  const prices = ALL_OPTIONS.map(({ option }) => finalPrice(option));

  const graph = [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: BRAND,
      url: SITE_URL,
      description: DESCRIPTION,
      slogan: TAGLINE,
      areaServed: { "@type": "Country", name: "Україна" },
      knowsLanguage: ["uk", "en"],
      ...(ORDER_EMAIL
        ? {
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer service",
              email: ORDER_EMAIL,
              availableLanguage: ["uk"],
            },
          }
        : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: BRAND,
      description: DESCRIPTION,
      inLanguage: "uk-UA",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#service`,
      name: "Створення персонального мультфільму за вашою історією",
      serviceType: "Персональна анімація на замовлення",
      description: DESCRIPTION,
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: [
        { "@type": "Country", name: "Україна" },
        ...CITIES.map((city) => ({ "@type": "City", name: city })),
      ],
      audience: {
        "@type": "Audience",
        audienceType:
          "пари, батьки, діти, друзі та близькі, які шукають подарунок на день народження, річницю, весілля чи ювілей",
      },
      hoursAvailable: "1 день на виготовлення",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: String(Math.min(...prices)),
        highPrice: String(Math.max(...prices)),
        offerCount: String(offers.length),
        offers,
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
