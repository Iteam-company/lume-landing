import { buildFaq } from "../faq";
// ЦІНИ ТИМЧАСОВО ПРИХОВАНІ: імпорти цін повернути разом із блоком offers нижче.
// import {
//   allOptions,
//   discount,
//   finalPrice,
//   LAUNCH_UNTIL,
//   perMinute,
// } from "../pricing";
import { ORDER_EMAIL } from "../config";
import { BRAND, SITE_URL } from "../site";
import dict from "../content/dictionary";
// ЦІНИ ТИМЧАСОВО ПРИХОВАНІ
// import { formatMinutes, formatPrice } from "../content/format";

/* ============================================================
   Структурована розмітка (JSON-LD).
   Дані беруться з тих самих content/dictionary і pricing.ts, що
   й видима частина сайту, тому розмітка не розʼїжджається з цінами.

   Мова тут завжди uk-UA — сайт лише українською.

   Валюта — НЕ від Geo відвідувача. Ціна в pricing.ts залежить від
   ринку (UAH/USD), але той самий бот (Google, AI-асистент) не має
   бачити то одну, то іншу валюту між заходами: це робить розмітку
   нестабільною для SEO. Тому для schema.org завжди береться одна
   канонічна валюта — UAH (основний ринок сайту, Україна), незалежно
   від того, з якої країни прийшов конкретний запит.
   ============================================================ */

const STRUCTURED_DATA_CURRENCY = "UAH" as const;

export default function StructuredData() {
  const sd = dict.structuredData;
  const bcp47 = "uk-UA";
  const base = SITE_URL;

  // ЦІНИ ТИМЧАСОВО ПРИХОВАНІ
  // const options = allOptions(STRUCTURED_DATA_CURRENCY);

  // ЦІНИ ТИМЧАСОВО ПРИХОВАНІ: обчислення пропозицій вимкнено разом із блоком offers.
  // const offers = options.map(({ tier, option }) => {
  //   const off = discount(option);
  //   const minutes = formatMinutes(option.minutes);
  //   return {
  //     "@type": "Offer",
  //     name: sd.offerName
  //       .replace("{brand}", BRAND)
  //       .replace("{tier}", tier.name)
  //       .replace("{minutes}", minutes),
  //     description: sd.offerDescription
  //       .replace("{minutes}", minutes)
  //       .replace("{rate}", formatPrice(perMinute(option), STRUCTURED_DATA_CURRENCY)),
  //     price: String(finalPrice(option)),
  //     priceCurrency: STRUCTURED_DATA_CURRENCY,
  //     availability: "https://schema.org/InStock",
  //     url: `${base}/#pricing`,
  //     eligibleQuantity: {
  //       "@type": "QuantitativeValue",
  //       value: option.minutes,
  //       unitCode: "MIN",
  //       unitText: sd.unitText,
  //     },
  //     ...(option.sale ? { priceValidUntil: LAUNCH_UNTIL } : {}),
  //     ...(option.sale && off
  //       ? {
  //           priceSpecification: {
  //             "@type": "PriceSpecification",
  //             price: String(option.base),
  //             priceCurrency: STRUCTURED_DATA_CURRENCY,
  //             valueAddedTaxIncluded: true,
  //           },
  //         }
  //       : {}),
  //   };
  // });

  // ЦІНИ ТИМЧАСОВО ПРИХОВАНІ
  // const prices = options.map(({ option }) => finalPrice(option));

  const graph = [
    {
      "@type": "Organization",
      "@id": `${base}#organization`,
      name: BRAND,
      url: base,
      description: dict.meta.description,
      slogan: dict.meta.tagline,
      areaServed: { "@type": "Country", name: sd.countryName },
      knowsLanguage: ["uk"],
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
      "@id": `${base}#website`,
      url: base,
      name: BRAND,
      description: dict.meta.description,
      inLanguage: bcp47,
      publisher: { "@id": `${base}#organization` },
    },
    {
      "@type": "Service",
      "@id": `${base}#service`,
      name: sd.serviceName,
      serviceType: sd.serviceType,
      description: dict.meta.description,
      provider: { "@id": `${base}#organization` },
      areaServed: [
        { "@type": "Country", name: sd.countryName },
        ...dict.audience.cities.map((city) => ({ "@type": "City", name: city })),
      ],
      audience: {
        "@type": "Audience",
        audienceType: sd.audienceType,
      },
      hoursAvailable: sd.hoursAvailable,
      // ЦІНИ ТИМЧАСОВО ПРИХОВАНІ: ціни не віддаємо пошуку й AI-асистентам.
      // offers: {
      //   "@type": "AggregateOffer",
      //   priceCurrency: STRUCTURED_DATA_CURRENCY,
      //   lowPrice: String(Math.min(...prices)),
      //   highPrice: String(Math.max(...prices)),
      //   offerCount: String(offers.length),
      //   offers,
      // },
    },
    {
      "@type": "FAQPage",
      "@id": `${base}#faq`,
      inLanguage: bcp47,
      mainEntity: buildFaq(STRUCTURED_DATA_CURRENCY).map((item) => ({
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
