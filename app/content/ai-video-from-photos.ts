import { getDictionary } from "./dictionaries";
import { LANG_OG, langPath } from "./lang";
import type { Metadata } from "next";
import type { QA } from "../faq";
import { BRAND } from "../site";

export const PHOTO_VIDEO_PATH = "/ai-video-from-photos";
export type PhotoVideoLang = "uk" | "en";

type PhotoVideoCopy = {
  meta: { title: string; description: string };
  heading: string;
  lead: string;
  handsOff: string;
  order: string;
  homeLink: string;
  worksHeading: string;
  worksLead: string;
  example: string;
  processHeading: string;
  steps: { title: string; text: string }[];
  occasionsHeading: string;
  occasionsLead: string;
  serviceHeading: string;
  serviceText: string;
  serviceNote: string;
  faq: QA[];
};

// Копірайт цієї послуги спирається на процес, FAQ та склад тарифів
// у dictionary.ts / dictionary.en.ts. Ціни лишаються в pricing.ts.
export const photoVideoContent: Record<PhotoVideoLang, PhotoVideoCopy> = {
  uk: {
    meta: {
      title: "AI-відео з фотографій на замовлення — LUME",
      description: "Персональне AI-відео чи мультфільм із ваших фотографій та історії. Українська студія LUME створює ролик під ключ — вам не потрібно працювати з AI або монтувати.",
    },
    heading: "AI-відео та персональний мультфільм із фотографій на замовлення",
    lead: "Ви надсилаєте фото й реальну історію. LUME — українська студія AI-відео та анімації — створює ролик під ключ: сценарій, персонажі, AI-анімація, музика й монтаж. Озвучення — за бажанням і відповідно до тарифу.",
    handsOff: "Вам не потрібно опановувати AI-генератори або монтувати відео. Ви ділитеся історією та узгоджуєте деталі — ми створюємо готовий мультфільм.",
    order: "Розповісти свою історію",
    homeLink: "Як створюємо AI-відео з фотографій на замовлення",
    worksHeading: "Історії, що оживають",
    worksLead: "Приклади робіт LUME. Ваш ролик створюємо за вашими фотографіями та історією.",
    example: "Приклад роботи LUME",
    processHeading: "Від фотографій до готового відео",
    steps: [
      { title: "Фотографії та історія", text: "Напишіть у Telegram або WhatsApp. У короткому брифі розкажіть про героїв і важливі моменти та надішліть фотографії." },
      { title: "Сценарій і розкадровка", text: "Працюємо над сюжетом і послідовністю сцен. Перед початком роботи узгоджуємо з вами сценарій та фотографії." },
      { title: "Персонажі та візуал", text: "За фотографіями створюємо персонажів, схожих на вас. Деталізація, стиль і складність сцен залежать від обраного тарифу." },
      { title: "AI-анімація", text: "Перетворюємо сцени на анімацію: додаємо рух, ефекти та атмосферу вашої історії." },
      { title: "Музика й озвучення", text: "Додаємо музику та звук. Озвучення й побажання щодо пісні обговорюємо під час брифу з урахуванням тарифу." },
      { title: "Монтаж", text: "Поєднуємо сцени, анімацію та звук у цілісний мультфільм. Правки — відповідно до обраного тарифу." },
      { title: "Готове відео", text: "Надсилаємо файл у Full HD на пошту. Його можна показати на святі, переслати близьким або опублікувати в соцмережах." },
    ],
    occasionsHeading: "Для історії, яку хочеться зберегти",
    occasionsLead: "Історія пари — від знайомства до спільних подорожей. Родинна хроніка з батьками, бабусею чи дідусем у головних ролях. Казка для дитини або тепле привітання другу. Персональний мультфільм стає подарунком на весілля, річницю чи день народження.",
    serviceHeading: "AI-відео під ключ",
    serviceText: "LUME — це послуга створення AI-відео під ключ, а не AI-генератор відео для самостійної роботи. Ви ділитеся фотографіями та історією, а ми створюємо готовий ролик. Вам не потрібно писати промпти, генерувати сцени чи займатися монтажем — усе це бере на себе студія.",
    serviceNote: "Ваш внесок — фотографії, реальна історія та побажання. Куратор допомагає з брифом і вибором тарифу, а сценарій та деталі ми узгоджуємо з вами.",
    faq: [
      { q: "Чи можна зробити мультфільм із фотографій?", a: "Так. Ви надсилаєте фотографії та розповідаєте свою історію. Ми створюємо схожих на вас персонажів, готуємо сценарій і розкадровку та перетворюємо історію на анімацію." },
      { q: "Скільки фотографій потрібно?", a: "Напишіть куратору в Telegram або WhatsApp і уточніть кількість фотографій для вашої історії. Перед початком роботи ми узгоджуємо фотографії та сценарій." },
      { q: "Скільки часу займає створення?", a: "{delivery}. Ви проходите короткий бриф і надсилаєте фотографії — наступного дня отримуєте готовий мультфільм." },
      { q: "Чи потрібно самостійно працювати з AI?", a: "Ні. LUME — послуга створення відео під ключ. Ви передаєте фотографії, історію та побажання, а студія працює над сценарієм, візуалом, AI-анімацією і монтажем." },
      { q: "Чи можна створити мультфільм про історію пари?", a: "Так. Це може бути історія знайомства, першого побачення, спільних подорожей і важливих дрібниць. Ви розповідаєте її у брифі, а ми перетворюємо на персональний мультфільм — наприклад, у подарунок на річницю чи весілля." },
      { q: "Чи входять озвучення, музика та монтаж?", a: "Музика та монтаж є частиною створення ролика. STORY передбачає готову музику і стандартне звукове оформлення. У SIGNATURE є озвучення та кінематографічна музика, у CINEMA — індивідуальне озвучення та пісня на замовлення. Побажання щодо звуку узгоджуємо під час брифу." },
      { q: "У якому форматі отримаю відео?", a: "У Full HD, файлом на пошту. Відео можна показати на екрані під час свята, надіслати в месенджері або опублікувати у соцмережах." },
    ],
  },
  en: {
    meta: {
      title: "Personalized AI Video from Photos, Made for You — LUME",
      description: "Turn your photos and real-life story into a personalized AI video or cartoon. Ukrainian studio LUME handles production — no AI tools or editing skills needed.",
    },
    heading: "Personalized AI videos and cartoons from your photos, made for you",
    lead: "Share your photos and real-life story. LUME, a Ukrainian AI video and animation studio, handles the script, characters, AI animation, music and editing. Voice-over depends on your wishes and chosen tier.",
    handsOff: "You don’t need to learn AI generators or edit a video yourself. Share your story and agree on the details — we make the finished cartoon.",
    order: "Tell us your story",
    homeLink: "How we create personalized AI videos from photos",
    worksHeading: "Real stories, brought to life",
    worksLead: "Examples of LUME’s work. Your film is created from your own photos and story.",
    example: "LUME work sample",
    processHeading: "From your photos to a finished video",
    steps: [
      { title: "Photos and your story", text: "Message us on Telegram or WhatsApp. In a short brief, tell us about the people and moments that matter, and send your photos." },
      { title: "Script and storyboard", text: "We work on the plot and sequence of scenes. Before production begins, we agree on the script and photos with you." },
      { title: "Characters and visuals", text: "We create characters that look like you from your photos. The detail, style and complexity of the scenes depend on your chosen tier." },
      { title: "AI animation", text: "We turn the scenes into animation, adding motion, effects and the atmosphere of your story." },
      { title: "Music and voice-over", text: "We add music and sound. Voice-over and song preferences are discussed during the brief, taking your tier into account." },
      { title: "Editing", text: "We bring the scenes, animation and sound together into a complete cartoon. Revision rounds depend on your chosen tier." },
      { title: "Your finished video", text: "You receive a Full HD file by email. Play it at a celebration, send it to someone you love, or share it on social media." },
    ],
    occasionsHeading: "For a story you want to keep",
    occasionsLead: "A couple’s story, from how you met to the trips you took together. A family chronicle starring your parents or grandparents. A fairy tale for a child or a warm greeting for a friend. A personalized animated video from photos makes a gift for a wedding, anniversary or birthday.",
    serviceHeading: "A complete service, made for you",
    serviceText: "LUME delivers a finished video rather than access to an AI video generator. You don’t need to choose tools, write prompts, generate scenes or put them together in an editor — the studio takes care of production.",
    serviceNote: "You bring the photos, real-life story and wishes. A curator helps with the brief and choice of tier, and we agree on the script and details with you.",
    faq: [
      { q: "Can you make a cartoon from photos?", a: "Yes. Send your photos and tell us your story. We create characters that look like you, prepare the script and storyboard, and turn your story into animation." },
      { q: "How many photos do I need?", a: "Message a curator on Telegram or WhatsApp to discuss how many photos to send for your story. Before production begins, we agree on the photos and script with you." },
      { q: "How long does it take?", a: "{delivery}. You go through a short brief and send your photos, then receive the finished cartoon the next day." },
      { q: "Do I need to use AI tools myself?", a: "No. LUME is a complete video production service. You share your photos, story and wishes; the studio handles the script, visuals, AI animation and editing." },
      { q: "Can you make a cartoon about our story as a couple?", a: "Yes. It can tell the story of how you met, your first date, the trips you took and the little moments that matter. You share the story in the brief and we turn it into a personalized cartoon, for example as an anniversary or wedding gift." },
      { q: "Are voice-over, music and editing included?", a: "Music and editing are part of making your film. STORY includes stock music and standard sound design. SIGNATURE includes voice-over and cinematic music; CINEMA includes custom voice-over and a custom song. We discuss your sound preferences during the brief." },
      { q: "What format will I receive?", a: "A Full HD file, delivered by email. You can play it on a screen at a celebration, send it in a messenger or share it on social media." },
    ],
  },
};

export function photoVideoFaq(lang: PhotoVideoLang): QA[] {
  const dict = getDictionary(lang);
  return photoVideoContent[lang].faq.map((item) => ({
    ...item,
    a: item.a.replace("{delivery}", dict.pricing.common[0]),
  }));
}

export function photoVideoMetadata(lang: PhotoVideoLang): Metadata {
  const { title, description } = photoVideoContent[lang].meta;
  const canonical = langPath(PHOTO_VIDEO_PATH, lang);
  return {
    title: { absolute: title },
    description,
    // Не успадковуємо перелік ключових слів головної сторінки.
    keywords: null,
    alternates: {
      canonical,
      languages: {
        "uk-UA": PHOTO_VIDEO_PATH,
        "en-US": langPath(PHOTO_VIDEO_PATH, "en"),
        "x-default": PHOTO_VIDEO_PATH,
      },
    },
    openGraph: {
      type: "website",
      siteName: BRAND,
      locale: LANG_OG[lang],
      url: canonical,
      title,
      description,
      images: [{ url: "/video/hero-poster.jpg", width: 1920, height: 1080, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/video/hero-poster.jpg"],
    },
  };
}
