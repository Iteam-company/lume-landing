import { FAQ } from "../faq";
import { discount, PLANS } from "../pricing";
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
  const offers = PLANS.map((plan) => {
    const off = discount(plan);
    return {
      "@type": "Offer",
      name: `${BRAND} ${plan.name} — мультфільм ${plan.duration}`,
      description: `Персональний мультфільм за вашою історією, хронометраж ${plan.duration}.`,
      price: String(plan.sale ?? plan.base),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/#pricing`,
      ...(plan.sale && off
        ? {
            priceSpecification: {
              "@type": "PriceSpecification",
              price: String(plan.base),
              priceCurrency: "USD",
              valueAddedTaxIncluded: true,
            },
          }
        : {}),
    };
  });

  const prices = PLANS.map((p) => p.sale ?? p.base);

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
        offerCount: String(PLANS.length),
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
