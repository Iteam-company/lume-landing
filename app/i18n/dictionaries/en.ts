/* ============================================================
   English dictionary. Shape must match uk.ts (`const en: Dictionary`).

   Marketing copy — natural English, same meaning and offer.
   Legal (privacy / terms) — faithful equivalent of the Ukrainian
   source: same structure, numbering, sums, terms, rights and duties.
   Ukrainian remains the source of truth.
   ============================================================ */

import type { Dictionary } from "./uk";
import type { LegalDoc, TierCopy, TierSlugKey } from "./types";

const tiers: Record<TierSlugKey, TierCopy> = {
  story: {
    tagline: "An affordable way to turn your story into a film",
    features: [
      "One main visual style",
      "Standard character detail",
      "Simpler direction and animation",
      "Stock music and standard sound design",
      "1 round of revisions",
    ],
    badge: null,
  },
  signature: {
    tagline: "A personal short film, not just a video",
    features: [
      "Deeper work on the story",
      "A scriptwriter and a storyboard",
      "Better facial consistency",
      "More unique locations and more complex scenes",
      "Voice-over and cinematic music",
      "2 rounds of revisions",
      "More elaborate editing",
    ],
    badge: "Best choice",
  },
  cinema: {
    tagline: "Maximum direction, detail, and sound",
    features: [
      "Bespoke art direction",
      "Maximum character likeness",
      "Complex direction and dynamic scenes",
      "Maximum detail",
      "Custom voice-over and serious sound design",
      "Several versions of the key scenes",
      "3 rounds of revisions",
      "Priority production",
    ],
    badge: null,
  },
};

const privacy: LegalDoc = {
  title: "Privacy Policy",
  updated: "Revised 1 January 2026",
  intro: [
    "This Privacy Policy explains what data the LUME website (hereinafter — the “Site”) collects, for what purpose it is processed, how it is stored, and to whom it may be transferred. By using the Site and submitting a request, the User confirms their agreement to the terms of this Policy.",
  ],
  sections: [
    {
      heading: "1. What data we collect",
      blocks: [
        { kind: "p", text: "1.1. Data the User provides voluntarily through the request form: name, phone number (WhatsApp), Telegram handle, email address." },
        { kind: "p", text: "1.2. Data the User transfers to us during correspondence for the fulfilment of an order: photographs, texts, wishes regarding the storyline, and other materials." },
        { kind: "p", text: "1.3. Technical data collected automatically: IP address, browser and device type, operating system, referral source, the Site pages the User viewed, and their actions on them." },
        { kind: "p", text: "1.4. We do not collect special categories of data and do not ask for payment details through the Site’s forms." },
      ],
    },
    {
      heading: "2. Purpose of processing",
      blocks: [
        {
          kind: "ul",
          items: [
            "contacting the User regarding a submitted request;",
            "agreeing, fulfilling, and delivering an order;",
            "responding to enquiries and providing support;",
            "improving the operation of the Site, analytics, and quality of service;",
            "complying with the requirements of the law.",
          ],
        },
      ],
    },
    {
      heading: "3. Legal grounds and consent",
      blocks: [
        { kind: "p", text: "3.1. Processing is carried out on the basis of the User’s consent, given by filling in and submitting the form on the Site." },
        { kind: "p", text: "3.2. Consent may be withdrawn at any time by contacting us using the contact details specified below. Withdrawal of consent does not affect the lawfulness of processing carried out before it." },
      ],
    },
    {
      heading: "4. Storage period",
      blocks: [
        { kind: "p", text: "4.1. Data is stored for as long as necessary to achieve the purposes of processing, and after the work on an order is completed — for the period established by law." },
        { kind: "p", text: "4.2. After this period expires, the data is deleted or anonymised." },
      ],
    },
    {
      heading: "5. Transfer to third parties",
      blocks: [
        { kind: "p", text: "5.1. We do not sell personal data and do not transfer it to third parties, except in cases where:" },
        {
          kind: "ul",
          items: [
            "it is necessary for the fulfilment of an order (for example, the communication, hosting, or cloud storage services we use);",
            "the User has given separate consent for this;",
            "this is required by law or by authorised state authorities.",
            "it concerns anonymised technical data transferred to advertising and analytics services, in particular Meta Platforms (see Section 6).",
          ],
        },
      ],
    },
    {
      heading: "6. Cookies, analytics, and advertising tools",
      blocks: [
        { kind: "p", text: "6.1. The Site uses cookies and web analytics services to assess the effectiveness of advertising and the convenience of use." },
        { kind: "p", text: "6.2. Meta Pixel is installed on the Site — a tool of Meta Platforms, which operates Facebook and Instagram. It automatically collects technical data about the visit (IP address, browser and device data, viewed pages, actions on the Site, in particular the submission of a request) and transfers it to Meta." },
        { kind: "p", text: "6.3. This data is used to measure the results of advertising campaigns, optimise the display of ads, and build audiences for advertising on Facebook and Instagram, including re-engaging visitors of the Site." },
        { kind: "p", text: "6.4. Meta Platforms acts as a separate recipient of the data and processes it in accordance with its own privacy policy. The data may be transferred and stored outside Ukraine." },
        { kind: "p", text: "6.5. The User may limit such collection: disable or delete cookies in the browser settings, use a tracker-blocking mode, and also change ad settings in their Facebook or Instagram account. Disabling cookies may affect the operation of individual features of the Site." },
      ],
    },
    {
      heading: "7. Data protection",
      blocks: [
        { kind: "p", text: "7.1. We take reasonable organisational and technical measures to protect data against unlawful access, loss, alteration, and disclosure." },
        { kind: "p", text: "7.2. Only persons who need it for the fulfilment of an order have access to the data." },
      ],
    },
    {
      heading: "8. User’s rights",
      blocks: [
        { kind: "p", text: "The User has the right to obtain information about the processing of their data, to demand its correction, restriction of processing, or deletion, and also to withdraw consent. To do so, it is sufficient to write to us at the contact address." },
      ],
    },
    {
      heading: "9. Changes to the Policy",
      blocks: [
        { kind: "p", text: "9.1. We may update this Policy. A new revision takes effect from the moment it is posted on the Site." },
        { kind: "p", text: "9.2. Continued use of the Site after an update constitutes agreement to the new revision." },
      ],
    },
  ],
};

const terms: LegalDoc = {
  title: "Terms of Use",
  updated: "Revised 1 January 2026",
  intro: [
    "These Terms of Use (hereinafter — the “Terms”) constitute a public offer and define the terms of use of the LUME website (hereinafter — the “Site”) between the Site Administration (hereinafter — the “Administration”) and a visitor of the Site (hereinafter — the “User”).",
  ],
  sections: [
    {
      heading: "1. Subject of the Terms",
      blocks: [
        { kind: "p", text: "1.1. The Administration provides the User with access to the Site and its functionality on the terms set out in these Terms." },
        { kind: "p", text: "1.2. By using the Site, the User confirms their full and unconditional agreement to the Terms. If the User does not agree with them, they must stop using the Site." },
        { kind: "p", text: "1.3. The Terms are a legally binding document and do not require signing on paper." },
      ],
    },
    {
      heading: "2. Services and functionality of the Site",
      blocks: [
        { kind: "p", text: "2.1. The Site is intended to inform about the services of creating custom personal animated videos (cartoons), as well as for submitting requests and interacting with the Administration." },
        { kind: "p", text: "2.2. A request left through the form on the Site is not a concluded contract. The scope of work, cost, and timeframes are agreed by the parties separately after the curator makes contact." },
        { kind: "p", text: "2.3. The list of the Site’s functions and capabilities may be changed by the Administration without prior notice." },
      ],
    },
    {
      heading: "3. User materials",
      blocks: [
        { kind: "p", text: "3.1. To fulfil an order, the User independently provides photographs, texts, and other materials." },
        { kind: "p", text: "3.2. By providing materials, the User confirms that they have the right to use and transfer them, and that such transfer does not violate the rights of third parties." },
        { kind: "p", text: "3.3. The Administration uses the provided materials solely for the fulfilment of an order. Their use in a portfolio or in advertising is possible only with the User’s separate consent." },
      ],
    },
    {
      heading: "4. Rules for using the Site",
      blocks: [
        { kind: "p", text: "4.1. The User undertakes to use the Site in accordance with its purpose and within the limits of applicable law." },
        { kind: "p", text: "4.2. The User is prohibited from:" },
        {
          kind: "ul",
          items: [
            "attempting to gain unauthorised access to the Site or to other users’ data;",
            "distributing malicious software, spam, or unlawful information through the Site;",
            "interfering with the operation of the Site, changing its code or functionality;",
            "violating the rights of third parties, in particular copyright and related rights.",
          ],
        },
        { kind: "p", text: "4.3. The Administration has the right to restrict or terminate the User’s access to the Site in the event of a violation of these Terms." },
      ],
    },
    {
      heading: "5. Intellectual property",
      blocks: [
        { kind: "p", text: "5.1. The design, texts, graphics, and other materials of the Site belong to the Administration or are used by it on lawful grounds and are protected by copyright law." },
        { kind: "p", text: "5.2. Copying and use of the Site’s materials without the written consent of the Administration is not permitted." },
      ],
    },
    {
      heading: "6. Liability of the parties",
      blocks: [
        { kind: "p", text: "6.1. The Site is provided on an “as is” basis. The Administration does not guarantee uninterrupted and error-free operation of the Site." },
        { kind: "p", text: "6.2. The Administration is not liable for losses arising from the use of or inability to use the Site, in particular for technical interruptions and data loss." },
        { kind: "p", text: "6.3. The User is solely responsible for the accuracy of the data they provide and for the consequences of their actions on the Site." },
      ],
    },
    {
      heading: "7. Analytics and advertising tools",
      blocks: [
        { kind: "p", text: "7.1. The Site uses cookies, web analytics services, and advertising tools, in particular Meta Pixel of Meta Platforms, to measure the effectiveness of advertising on Facebook and Instagram and to display ads to visitors of the Site." },
        { kind: "p", text: "7.2. By continuing to use the Site, the User agrees to such collection of technical data. It can be limited through browser settings and ad settings in your account. The processing procedure is described in the {link}.", link: { label: "Privacy Policy" } },
      ],
    },
    {
      heading: "8. Personal data",
      blocks: [
        { kind: "p", text: "8.1. The Administration processes the User’s personal data in accordance with the {link}, which is an integral part of these Terms.", link: { label: "Privacy Policy" } },
      ],
    },
    {
      heading: "9. Term and changes to the Terms",
      blocks: [
        { kind: "p", text: "9.1. The Terms take effect from the moment the Site is first used and remain in force indefinitely." },
        { kind: "p", text: "9.2. The Administration has the right to change the Terms unilaterally. A new revision takes effect from the moment it is posted on the Site. Continued use of the Site constitutes agreement to the updated revision." },
      ],
    },
    {
      heading: "10. Dispute resolution",
      blocks: [
        { kind: "p", text: "10.1. Disputes arising in connection with these Terms shall be resolved by the parties through negotiations, and if agreement is not reached — in the manner prescribed by applicable law." },
      ],
    },
    {
      heading: "11. Miscellaneous",
      blocks: [
        { kind: "p", text: "11.1. If a particular provision of the Terms is found to be invalid, the remaining provisions retain their force." },
        { kind: "p", text: "11.2. In all other respects, the parties are governed by applicable law." },
      ],
    },
  ],
};

const en: Dictionary = {
  meta: {
    title: "LUME — a personal cartoon from your story",
    tagline: "A personal cartoon from your story",
    description:
      "We create personal cartoons from your story and photos: " +
      "a gift for a birthday, anniversary, wedding, jubilee, or gender reveal. " +
      "Ready in 1 day, Full HD, working online throughout Ukraine.",
    keywords: [
      "cartoon from photos",
      "personal cartoon",
      "custom cartoon",
      "cartoon from your story",
      "animation from photographs",
      "video gift",
      "birthday gift",
      "anniversary gift",
      "wedding gift",
      "gift for a wife",
      "gift for a husband",
      "gift for mom",
      "original gift Ukraine",
      "love story cartoon",
      "gender reveal video",
      "birthday greeting video",
      "order a cartoon Kyiv",
      "custom cartoon Ukraine",
    ],
    category: "Gifts and personal animation",
    privacyTitle: "Privacy Policy",
    privacyDescription:
      "What data the LUME website collects, for what purpose it is processed, how it is stored, and to whom it is transferred.",
    termsTitle: "Terms of Use",
    termsDescription: "The terms of use of the LUME website and how orders are placed.",
  },

  common: {
    orderCta: "Order a cartoon",
  },

  hero: {
    titleLines: ["Give someone you love", "a cartoon", "made from your story"],
    sub: "For couples, parents, kids, friends, and loved ones",
    bullets: [
      "200+ cartoons created",
      "Made in 1 day",
      "A personal curator",
    ],
  },

  works: {
    heading: "Our work",
  },

  reactions: {
    heading: "Client reactions:",
    captions: ["Love", "Warm moments", "Birthday", "Love"],
  },

  process: {
    headingPrefix: "A cartoon in ",
    headingAccent: "1 day",
    steps: [
      {
        title: ["Brief"],
        text: "You fill in a short questionnaire: tell your story, share the details and the moments that matter",
      },
      {
        title: ["Photos and", "characters"],
        text: "You send photographs — we draw characters that look as close to you as possible",
      },
      {
        title: ["Script and", "storyboard"],
        text: "We work through the plot, rhythm, and drama so the story feels whole and moving",
      },
      {
        title: ["Editing and", "the cartoon"],
        text: "We bring it all together: motion, effects, atmosphere. Optionally — voice-over or your favourite song",
      },
    ],
  },

  numbers: {
    heading: "Numbers:",
    labels: [
      "cartoons created",
      "happy clients",
      "curator’s reply",
      "production time",
    ],
    response: "15 min",
    delivery: "1 day",
  },

  pricing: {
    heading: "Pricing:",
    lead: "Pay per minute: each tier has a fixed rate, and you choose the length.",
    commonPrefix: "In every tier: ",
    common: [
      "Ready in 1 day",
      "Full HD for phone and social media",
      "A personal curator",
    ],
    noteCurrency: "Prices are shown in US dollars.",
    noteConfirm: "The curator will confirm the exact price after the brief.",
    perMinute: "per minute",
    minutesShort: "min",
    durationAria: "Length, {name} tier",
    launchNote: "Launch price valid until {date}",
    songAdd: "Add a custom song",
    songIncluded: "Custom song included",
    orderCard: "Order",
    tiers,
  },

  audience: {
    heading: "Who it’s for",
    lead: "A personal cartoon is a gift you can’t buy in a store: we draw you from your own photos and tell your own story.",
    paragraphs: [
      "You tell us how you met, what brought you together, and which moments you want to keep. We turn it into animation: the characters look like you, the plot is yours, and if you like we add voice-over or your favourite song. The finished cartoon arrives the next day in Full HD — you can show it on a screen at a restaurant, send it in a messenger, or post it on social media.",
    ],
    citiesParagraph:
      "We work online, so your city doesn’t matter: you send the brief and photos in a messenger and receive the finished file by email. Orders come most often from these cities: {cities} — as well as from Ukrainians abroad who want to congratulate their loved ones back home.",
    forWhom: [
      { who: "For your partner", what: "how you met, your first date, trips you took together" },
      { who: "For parents and grandparents", what: "a family chronicle in which they are the main characters" },
      { who: "For a child", what: "a fairy tale where the child becomes a cartoon character" },
      { who: "For friends and colleagues", what: "a warm story instead of yet another gift card" },
    ],
    occasionsHeading: "Occasions people order for most often",
    occasions: [
      "Birthday",
      "Relationship anniversary",
      "Wedding",
      "Jubilee",
      "Gender reveal",
      "Proposal",
      "Birth of a child",
      "Graduation",
      "International Women’s Day",
      "Valentine’s Day",
      "New Year",
      "Thank-you for a team",
    ],
    cities: [
      "Kyiv",
      "Lviv",
      "Odesa",
      "Kharkiv",
      "Dnipro",
      "Zaporizhzhia",
      "Vinnytsia",
      "Ivano-Frankivsk",
      "Poltava",
      "Chernivtsi",
    ],
  },

  faq: {
    heading: "FAQ:",
    priceFrom: "from",
    priceTo: "to",
    priceFor: "for",
    perMinuteWord: "per minute",
    currencyNote: "Prices are shown in US dollars.",
    items: [
      {
        q: "How long does it take to create?",
        a: "1 day. You submit a request, go through a short brief, send photos — and the next day you receive the finished cartoon.",
      },
      {
        q: "How much does a cartoon cost?",
        a: "The price depends on the tier and the length: {prices} {currencyNote}",
      },
      {
        q: "How do you make a cartoon from photographs?",
        a: "You send photographs, and we draw characters that look as close to you as possible, write the script and storyboard from your story, and bring it all together into animation.",
      },
      {
        q: "Will it really capture what I want?",
        a: "Before we start, we agree the script and photos in detail so you get exactly what you had in mind.",
      },
      {
        q: "What format will I receive the cartoon in?",
        a: "Full HD, a file for phone and social media. You can show it on a screen at a restaurant, send it in a messenger, or post it on Instagram.",
      },
      {
        q: "Can I add voice-over or a song?",
        a: "Yes. If you like, we add voice-over or your favourite song — we agree this during the brief.",
      },
      {
        q: "What occasions do people order a cartoon for?",
        a: "Most often — for a birthday, relationship anniversary, wedding, jubilee, gender reveal, proposal, and as a gift for parents or children.",
      },
      {
        q: "Do you work throughout Ukraine?",
        a: "Yes, we work online: you send the brief and photos in a messenger and receive the finished file by email. Orders come from Kyiv, Lviv, Odesa, Kharkiv, Dnipro, and from abroad.",
      },
      {
        q: "How do I start?",
        a: "Leave a request on the site — the curator will get in touch within 15 minutes.",
      },
    ],
  },

  form: {
    nameLabel: "Name:",
    namePlaceholder: "Your name",
    nameError: "Please enter your name",
    phoneLabel: "Your phone number with WhatsApp",
    phonePlaceholder: "+380 (00) 000-00-00",
    phoneError: "Enter a valid phone number",
    telegramLabel: "Your Telegram handle",
    telegramHint: "If you don’t have one, leave this field empty",
    telegramPlaceholder: "@nickname",
    telegramError: "The handle may contain Latin letters, digits, and “_”",
    emailLabel: "Your email",
    emailHint: "We’ll send the order details and the finished cartoon to this address",
    emailPlaceholder: "you@example.com",
    emailError: "Enter a valid email",
    submit: "Order a cartoon",
    submitting: "Sending…",
    submitToPay: "Proceed to payment",
    submitError: "Could not send the request. Check your connection and try again.",
    privacyNoteBefore: "By clicking the button, you agree to the ",
    privacyNoteLink: "privacy policy",
    okPaidTitle: "Payment received. Thank you!",
    okPaidText: "The curator will confirm the order and get in touch with you.",
    okClosedTitle: "Thank you! Your request has been sent.",
    okClosedText: "Payment was not completed — the curator will get in touch within 15 minutes.",
    okOpeningTitle: "Request sent. Opening payment…",
    okOpeningText: "Complete the payment in the Paddle window that appeared.",
    okSentTitle: "Thank you! Your request has been sent.",
    okSentText: "The curator will get in touch with you within 15 minutes.",
    leadContentName: "Request form",
  },

  footer: {
    rights: "© LUME, 2026. All rights reserved.",
    terms: "Terms of Use",
    privacy: "Privacy Policy",
    support: "Support",
    instagram: "Instagram",
  },

  floats: {
    instagramAria: "Find us on Instagram",
    telegramAria: "Message us on Telegram",
    whatsappAria: "Message us on WhatsApp",
  },

  video: {
    play: "Play video",
    placeholder: "Video coming soon",
  },

  legal: {
    back: "Home",
    contactHeading: "Contact information",
    contactName: "Legal name:",
    contactReg: "Registration number:",
    contactEmail: "E-mail:",
    privacy,
    terms,
  },

  structuredData: {
    offerName: "{brand} {tier} — {minutes} cartoon",
    offerDescription:
      "A personal cartoon from your story, {minutes} long. That’s {rate} per minute.",
    serviceName: "Creating a personal cartoon from your story",
    serviceType: "Custom personal animation",
    audienceType:
      "couples, parents, children, friends and loved ones looking for a gift for a birthday, anniversary, wedding, or jubilee",
    countryName: "Ukraine",
    hoursAvailable: "1 day for production",
    unitText: "minutes of animation",
  },
};

export default en;
