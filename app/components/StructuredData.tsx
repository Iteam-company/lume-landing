import { buildFaq, type QA } from "../faq";
import {
  allOptions,
  discount,
  finalPrice,
  LAUNCH_UNTIL,
  perMinute,
} from "../pricing";
import { ORDER_EMAIL } from "../config";
import { BRAND, LOGO_PATH, SAME_AS, SITE_URL } from "../site";
import { getDictionary } from "../content/dictionaries";
import { LANG_BCP47, langPath, type Lang } from "../content/lang";
import { formatMinutes, formatPrice } from "../content/format";

/* ============================================================
   Структурована розмітка (JSON-LD).
   Дані беруться з тих самих content/dictionary і pricing.ts, що
   й видима частина сайту, тому розмітка не розʼїжджається з цінами.

   Мова розмітки збігається з мовою сторінки.

   Валюта — НЕ від Geo відвідувача. Ціна в pricing.ts залежить від
   ринку (UAH/EUR), але той самий бот (Google, AI-асистент) не має
   бачити то одну, то іншу валюту між заходами: це робить розмітку
   нестабільною для SEO. Тому для schema.org завжди береться одна
   канонічна валюта — UAH (основний ринок сайту, Україна), незалежно
   від того, з якої країни прийшов конкретний запит.
   ============================================================ */

const STRUCTURED_DATA_CURRENCY = "UAH" as const;

/** Відео на сторінці (VideoObject). Шляхи — від кореня сайту. */
export type PageVideo = {
  /** Якір у @id: `${url}#video-${id}` */
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  contentUrl: string;
  /** ISO 8601, напр. "PT2M34S" */
  duration: string;
  /** Коли відео з'явилося на сайті, YYYY-MM-DD */
  uploadDate: string;
};

type PageData = {
  path: string;
  title: string;
  description: string;
  faq: QA[];
  /** Назва сторінки в хлібних крихтах: «LUME → назва». */
  breadcrumb?: string;
  videos?: PageVideo[];
};

export default function StructuredData({ lang, page }: { lang: Lang; page?: PageData }) {
  const dict = getDictionary(lang);
  const sd = dict.structuredData;
  const bcp47 = LANG_BCP47[lang];
  const base = SITE_URL + langPath(page?.path ?? "/", lang);
  // Одна студія та один сайт для всіх мовних версій.
  const organizationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;

  const options = allOptions(STRUCTURED_DATA_CURRENCY);

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
        .replace("{rate}", formatPrice(perMinute(option), STRUCTURED_DATA_CURRENCY, lang)),
      price: String(finalPrice(option)),
      priceCurrency: STRUCTURED_DATA_CURRENCY,
      availability: "https://schema.org/InStock",
      url: `${base}#pricing`,
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
              priceCurrency: STRUCTURED_DATA_CURRENCY,
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
      "@id": organizationId,
      name: BRAND,
      url: `${SITE_URL}/`,
      logo: {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#logo`,
        url: SITE_URL + LOGO_PATH,
        width: 512,
        height: 512,
        caption: BRAND,
      },
      image: { "@id": `${SITE_URL}/#logo` },
      sameAs: SAME_AS,
      description: dict.audience.lead,
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
      "@id": websiteId,
      url: `${SITE_URL}/`,
      name: BRAND,
      description: dict.meta.description,
      inLanguage: ["uk-UA", "en-US"],
      publisher: { "@id": organizationId },
    },
    {
      "@type": "Service",
      "@id": `${base}#service`,
      name: sd.serviceName,
      serviceType: sd.serviceType,
      description: page?.description ?? dict.meta.description,
      provider: { "@id": organizationId },
      areaServed: [
        { "@type": "Country", name: sd.countryName },
        ...dict.audience.cities.map((city) => ({ "@type": "City", name: city })),
      ],
      audience: {
        "@type": "Audience",
        audienceType: sd.audienceType,
      },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: STRUCTURED_DATA_CURRENCY,
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
      mainEntity: (page?.faq ?? buildFaq(STRUCTURED_DATA_CURRENCY, lang)).map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    ...(page ? [{
      "@type": "WebPage",
      "@id": `${base}#webpage`,
      url: base,
      name: page.title,
      description: page.description,
      inLanguage: bcp47,
      isPartOf: { "@id": websiteId },
      mainEntity: { "@id": `${base}#service` },
      hasPart: { "@id": `${base}#faq` },
      ...(page.breadcrumb ? { breadcrumb: { "@id": `${base}#breadcrumb` } } : {}),
      ...(page.videos?.length ? { video: page.videos.map((v) => ({ "@id": `${base}#video-${v.id}` })) } : {}),
    }] : []),
    ...(page?.breadcrumb ? [{
      "@type": "BreadcrumbList",
      "@id": `${base}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: BRAND, item: SITE_URL + langPath("/", lang) },
        { "@type": "ListItem", position: 2, name: page.breadcrumb, item: base },
      ],
    }] : []),
    ...(page?.videos ?? []).map((v) => ({
      "@type": "VideoObject",
      "@id": `${base}#video-${v.id}`,
      name: v.name,
      description: v.description,
      thumbnailUrl: SITE_URL + v.thumbnail,
      contentUrl: SITE_URL + v.contentUrl,
      duration: v.duration,
      uploadDate: v.uploadDate,
      inLanguage: bcp47,
      publisher: { "@id": organizationId },
      isPartOf: { "@id": `${base}#webpage` },
    })),
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c"),
      }}
    />
  );
}
