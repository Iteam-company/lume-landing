import { LANG_OG, langPath } from "./lang";
import type { Metadata } from "next";
import type { QA } from "../faq";
import { BRAND } from "../site";

/* ============================================================
   Гайд «Як зробити мультфільм з фото».

   Відповідає на запит, з яким люди приходять у пошук і до AI-асистентів
   («де зробити мультфільм з фото», "how to make a cartoon from photos"):
   спершу коротка пряма відповідь, далі два способи й порівняння.

   Чесно: самостійний спосіб описуємо лише як процес — без назв
   сторонніх сервісів, їхніх цін і оцінок якості. Усе про LUME взято
   з уже опублікованого на сайті (тарифи, FAQ, інструкція для клієнтів).
   Ціни на сторінці підставляються з pricing.ts; у FAQ (а отже й у JSON-LD)
   цифр немає — щоб розмітка не залежала від валюти відвідувача.
   ============================================================ */

export const GUIDE_PATH = "/how-to-make-a-cartoon-from-photos";
export type GuideLang = "uk" | "en";

const GUIDE_OG = "/video/pipeline-page/og-case.jpg";

type Way = { title: string; steps: string[]; fit: string };

type GuideCopy = {
  meta: { title: string; description: string };
  heading: string;
  /** Посилання у футері. */
  footerLink: string;
  breadcrumb: string;
  nav: { id: string; label: string }[];
  hero: { kicker: string; answer: string; about: string; order: string; imageAlt: string };
  ways: { heading: string; self: Way; lume: Way & { priceFrom: string; perMinute: string; pricingLink: string } };
  compare: { heading: string; columns: [string, string]; rows: [string, string, string][] };
  photos: { heading: string; items: string[]; caseTitle: string; caseText: string; caseLink: string };
  faqHeading: string;
  faq: QA[];
};

export const guideContent: Record<GuideLang, GuideCopy> = {
  uk: {
    meta: {
      title: "Як зробити мультфільм з фото: самостійно чи на замовлення — LUME",
      description: "Два способи отримати мультфільм із ваших фотографій: зробити самому в AI-генераторі або замовити під ключ у студії. Що потрібно для кожного й як це працює в LUME.",
    },
    heading: "Як зробити мультфільм з фото",
    footerLink: "Як зробити мультфільм з фото",
    breadcrumb: "Як зробити мультфільм з фото",
    nav: [
      { id: "ways", label: "Два способи" },
      { id: "compare", label: "Порівняння" },
      { id: "photos", label: "Які фото" },
      { id: "faq", label: "FAQ" },
    ],
    hero: {
      kicker: "Короткий гайд",
      answer: "Є два способи: зробити ролик самостійно за допомогою AI-генераторів або замовити персональний мультфільм у студії, яка зробить усе під ключ. Нижче — що потрібно для кожного, щоб обрати свій.",
      about: "LUME — українська студія AI-відео та анімації. Створюємо персональні відео й мультфільми з ваших фотографій і реальних історій.",
      order: "Замовити мультфільм",
      imageAlt: "Реальне фото пари і та сама пара в мультфільмі LUME",
    },
    ways: {
      heading: "Два способи",
      self: {
        title: "Самостійно в AI-генераторі",
        steps: [
          "Підібрати інструменти для зображень, анімації, звуку й монтажу",
          "Перетворити фото на персонажа і стежити, щоб він був схожим у кожній сцені",
          "Писати промпти для кожної сцени та генерувати варіанти",
          "Анімувати сцени",
          "Додати музику, за потреби — озвучення",
          "Змонтувати все в один ролик",
        ],
        fit: "Підходить, якщо хочете самі розібратися в інструментах і маєте час на експерименти.",
      },
      lume: {
        title: "Під ключ у LUME",
        steps: [
          "Напишіть у Telegram або WhatsApp — куратор відповість протягом 15 хвилин",
          "Надішліть по 2–3 фото кожного героя й розкажіть історію своїми словами",
          "Ми готуємо сценарій і розкадровку та узгоджуємо їх з вами",
          "Створюємо персонажів, сцени, анімацію, музику й монтаж",
          "Ви отримуєте готовий мультфільм у Full HD на пошту",
        ],
        fit: "Підходить, якщо потрібен готовий подарунок без роботи з AI. Готово за 1 день.",
        priceFrom: "від",
        perMinute: "за хвилину",
        pricingLink: "Тарифи",
      },
    },
    compare: {
      heading: "Порівняння",
      columns: ["Самостійно", "LUME"],
      rows: [
        ["Сценарій", "Пишете самі", "Пише студія й узгоджує з вами"],
        ["Персонажі й схожість", "Генеруєте й контролюєте самі", "Студія опрацьовує кожного героя в кількох ракурсах"],
        ["Сцени й анімація", "Промпти й генерація для кожної сцени", "Робить студія"],
        ["Музика й монтаж", "Збираєте й монтуєте самі", "Робить студія; озвучення — за тарифом"],
        ["Що потрібно від вас", "Інструменти, час і навички", "Фото, історія й побажання"],
        ["Результат", "Залежить від інструментів і досвіду", "Готовий мультфільм у Full HD, правки за тарифом"],
      ],
    },
    photos: {
      heading: "Які фото підійдуть",
      items: [
        "По 2–3 якісні фото кожного героя",
        "Обличчя добре видно, бажано — з різних ракурсів",
        "Селфі теж підходить, якщо добре видно обличчя",
        "Фото й відео моментів, які хочете відтворити",
        "Домашній улюбленець теж може стати персонажем",
      ],
      caseTitle: "Реальний кейс",
      caseText: "Як фото пари стали мультфільмом: персонажі, справжній момент освідчення і готовий фільм.",
      caseLink: "Дивитися кейс →",
    },
    faqHeading: "Питання",
    faq: [
      { q: "Чи можна зробити мультфільм з фото без досвіду роботи з AI?", a: "Так, якщо замовити його під ключ: ви надсилаєте фото та історію, а сценарій, персонажів, анімацію, звук і монтаж робить студія. Самостійно знадобиться розібратися в AI-інструментах і монтажі." },
      { q: "Скільки фото потрібно для мультфільму?", a: "По 2–3 якісні фотографії кожної людини, яка буде в мультфільмі. Бажано, щоб обличчя було добре видно, з різних ракурсів." },
      { q: "Скільки часу займає створення на замовлення?", a: "1 день. Ви проходите короткий бриф і надсилаєте фотографії — наступного дня отримуєте готовий мультфільм." },
      { q: "Скільки коштує мультфільм з фото на замовлення?", a: "Вартість залежить від тарифу та хронометражу — від 1 до 5 хвилин. Актуальні ціни — на головній сторінці в розділі «Вартість», точну суму куратор підтвердить після брифу." },
      { q: "Чи потрібно самому писати сценарій?", a: "Ні. Поділіться важливими подіями, а ми допоможемо перетворити їх на цілісну історію й узгодимо сценарій з вами перед початком роботи." },
    ],
  },
  en: {
    meta: {
      title: "How to Make a Cartoon from Photos: DIY or Made for You — LUME",
      description: "Two ways to turn your photos into a cartoon: make it yourself with AI generators, or have a studio create it for you. What each takes, and how it works at LUME.",
    },
    heading: "How to make a cartoon from photos",
    footerLink: "How to make a cartoon from photos",
    breadcrumb: "How to make a cartoon from photos",
    nav: [
      { id: "ways", label: "Two ways" },
      { id: "compare", label: "Comparison" },
      { id: "photos", label: "Which photos" },
      { id: "faq", label: "FAQ" },
    ],
    hero: {
      kicker: "A quick guide",
      answer: "There are two ways: make the video yourself with AI generators, or order a personalized cartoon from a studio that handles everything. Here is what each one takes, so you can pick yours.",
      about: "LUME is a Ukrainian AI video and animation studio. We create personalized videos and cartoons from your photos and real-life stories.",
      order: "Order a cartoon",
      imageAlt: "A real photo of a couple and the same couple in a LUME cartoon",
    },
    ways: {
      heading: "Two ways",
      self: {
        title: "On your own with an AI generator",
        steps: [
          "Pick tools for images, animation, sound and editing",
          "Turn the photos into a character and keep it looking the same in every scene",
          "Write prompts for each scene and generate options",
          "Animate the scenes",
          "Add music, plus a voice-over if you want one",
          "Edit everything into one video",
        ],
        fit: "A good fit if you want to learn the tools yourself and have time to experiment.",
      },
      lume: {
        title: "Made for you by LUME",
        steps: [
          "Message us on Telegram or WhatsApp — a curator replies within 15 minutes",
          "Send 2–3 photos of each person and tell us your story in your own words",
          "We write the script and storyboard and agree on them with you",
          "We create the characters, scenes, animation, music and edit",
          "You get the finished cartoon as a Full HD file by email",
        ],
        fit: "A good fit if you want a finished gift without working with AI. Ready in 1 day.",
        priceFrom: "from",
        perMinute: "per minute",
        pricingLink: "See tiers",
      },
    },
    compare: {
      heading: "Side by side",
      columns: ["On your own", "LUME"],
      rows: [
        ["Script", "You write it", "The studio writes it and agrees it with you"],
        ["Characters and likeness", "You generate and check them", "Each person is worked out from several angles"],
        ["Scenes and animation", "Prompts and generation for every scene", "Done by the studio"],
        ["Music and editing", "You put it together and edit", "Done by the studio; voice-over depends on the tier"],
        ["What you need", "Tools, time and skills", "Photos, your story and wishes"],
        ["Result", "Depends on the tools and your experience", "A finished Full HD cartoon, revisions per tier"],
      ],
    },
    photos: {
      heading: "Which photos work",
      items: [
        "2–3 good photos of each person",
        "Faces clearly visible, ideally from different angles",
        "A selfie works too, as long as the face is clear",
        "Photos and videos of moments you want recreated",
        "Your pet can become a character too",
      ],
      caseTitle: "A real story",
      caseText: "How a couple’s photos became a cartoon: the characters, the real proposal and the finished film.",
      caseLink: "See the story →",
    },
    faqHeading: "Questions",
    faq: [
      { q: "Can I get a cartoon from photos without any AI experience?", a: "Yes, if you have it made for you: you send photos and your story, and the studio handles the script, characters, animation, sound and editing. Doing it yourself means learning AI tools and video editing." },
      { q: "How many photos do I need for a cartoon?", a: "2–3 good photos of each person who will appear in the film. Faces should be clearly visible, ideally from different angles." },
      { q: "How long does a made-to-order cartoon take?", a: "1 day. You go through a short brief and send your photos, then receive the finished cartoon the next day." },
      { q: "How much does a cartoon from photos cost?", a: "It depends on the tier and the length, from 1 to 5 minutes. Current prices are in the Pricing section on the home page; a curator confirms the exact amount after the brief." },
      { q: "Do I need to write the script myself?", a: "No. Share the moments that matter and we’ll help shape them into one story, agreeing the script with you before production begins." },
    ],
  },
};

export function guideMetadata(lang: GuideLang): Metadata {
  const { title, description } = guideContent[lang].meta;
  const canonical = langPath(GUIDE_PATH, lang);
  return {
    title: { absolute: title },
    description,
    keywords: null,
    alternates: {
      canonical,
      languages: {
        "uk-UA": GUIDE_PATH,
        "en-US": langPath(GUIDE_PATH, "en"),
        "x-default": GUIDE_PATH,
      },
    },
    openGraph: {
      type: "article",
      siteName: BRAND,
      locale: LANG_OG[lang],
      url: canonical,
      title,
      description,
      images: [{ url: GUIDE_OG, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [GUIDE_OG] },
  };
}
