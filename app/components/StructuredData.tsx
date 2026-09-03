import { buildFaq } from "../faq";
import {
  allOptions,
  discount,
  finalPrice,
  LAUNCH_UNTIL,
  perMinute,
} from "../pricing";
import { ORDER_EMAIL } from "../config";
import { BRAND, SITE_URL } from "../site";
import {
  localeToBcp47,
  localeToCurrency,
  type Locale,
} from "../i18n/config";
import { getDictionary } from "../i18n/dictionaries";
import { formatMinutes, formatPrice } from "../i18n/format";

/* ============================================================
   Структурована розмітка (JSON-LD).
   Дані беруться з тих самих словників і pricing.ts, що й видима
   частина сайту, тому розмітка не розʼїжджається з цінами.
   Мова та валюта — за локаллю сторінки.
   ============================================================ */

export default function StructuredData({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const sd = dict.structuredData;
  const currency = localeToCurrency(lang);
  const bcp47 = localeToBcp47(lang);
  const base = `${SITE_URL}/${lang}`;

  const options = allOptions(currency);

  const offers = options.map(({ tier, option }) => {
    const off = discount(option);
    const minutes = formatMinutes(option.minutes, lang);
    return {
      "@type": "Offer",
      name: sd.offerName
        .replace("{brand}", BRAND)
        .replace("{tier}", tier.name)
        .replace("{minutes}", minutes),
      description: sd.offerDescription
        .replace("{minutes}", minutes)
        .replace("{rate}", formatPrice(perMinute(option), lang)),
      price: String(finalPrice(option)),
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      url: `${base}/#pricing`,
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        value: option.minutes,
        unitCode: "MIN",
        unitText: sd.unitText,
      },
      ...(option.sale ? { priceValidUntil: LAUNCH_UNTIL } : {}),
      ...(option.sale && off
        ? {
            priceSpecification: {
              "@type": "PriceSpecification",
              price: String(option.base),
              priceCurrency: currency,
              valueAddedTaxIncluded: true,
            },
          }
        : {}),
    };
  });

  const prices = options.map(({ option }) => finalPrice(option));

  const graph = [
    {
      "@type": "Organization",
      "@id": `${base}#organization`,
      name: BRAND,
      url: base,
      description: dict.meta.description,
      slogan: dict.meta.tagline,
      areaServed: { "@type": "Country", name: sd.countryName },
      knowsLanguage: ["uk", "en"],
      ...(ORDER_EMAIL
        ? {
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer service",
              email: ORDER_EMAIL,
              availableLanguage: ["uk", "en"],
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
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: currency,
        lowPrice: String(Math.min(...prices)),
        highPrice: String(Math.max(...prices)),
        offerCount: String(offers.length),
        offers,
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${base}#faq`,
      inLanguage: bcp47,
      mainEntity: buildFaq(lang).map((item) => ({
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
