import { LANG_OG, langPath } from "./lang";
import type { Metadata } from "next";
import type { QA } from "../faq";
import { BRAND } from "../site";

export const PHOTO_VIDEO_PATH = "/ai-video-from-photos";
export type PhotoVideoLang = "uk" | "en";

/* ============================================================
   Сторінка «AI-відео з фотографій».

   Будується навколо ОДНОГО реального кейсу: пара дала згоду на
   публікацію своїх фото, персонажів, відео освідчення та реакції.
   Усе, що тут сказано про кейс, видно в самих матеріалах — повід
   замовлення й деталі стосунків пари не вигадуємо.

   «Що потрібно від вас» і FAQ спираються на інструкцію, яку куратор
   надсилає клієнтам, та на тарифи з dictionary.ts. Варіанти
   хронометражу з інструкції свідомо НЕ публікуємо: вони поки
   розходяться з правилами тарифів (1–5 хвилин).
   ============================================================ */

/** Один крок історії «фото → фільм». */
type StoryStep = { label: string; caption: string; alt: string };

/** Пара «фото → персонаж»: що саме перенесли з фото в образ. */
type PairCopy = { title: string; details: string[]; photoAlt: string; characterAlt: string; sceneAlt: string };

type PhotoVideoCopy = {
  meta: { title: string; description: string };
  heading: string;
  /** Посилання з головної на цю сторінку (блок Audience). */
  homeLink: string;
  nav: { id: string; label: string }[];
  hero: {
    kicker: string;
    lead: string;
    note: string;
    order: string;
    photoLabel: string;
    cartoonLabel: string;
    photoAlt: string;
    cartoonAlt: string;
  };
  story: { kicker: string; heading: string; lead: string; steps: StoryStep[] };
  pairs: {
    heading: string;
    lead: string;
    photoLabel: string;
    sceneLabel: string;
    items: PairCopy[];
  };
  brief: { heading: string; photosCount: string; photosText: string; items: string[]; note: string };
  likeness: {
    heading: string;
    sheetAlt: string;
    angles: string[];
    points: string[];
    looksCaption: string;
    looksAlt: string[];
    petCaption: string;
    petAlt: string;
  };
  moment: { heading: string; lead: string; real: string; cartoon: string };
  film: { heading: string; lead: string; filmCaption: string; reactionHeading: string; reactionCaption: string };
  compare: { heading: string; selfTitle: string; self: string[]; lumeTitle: string; lume: string[] };
  result: { heading: string; items: string[]; priceFrom: string; perMinute: string; compareLink: string };
  faqHeading: string;
  faq: QA[];
};

export const photoVideoContent: Record<PhotoVideoLang, PhotoVideoCopy> = {
  uk: {
    meta: {
      title: "AI-відео з фотографій на замовлення — LUME",
      description: "Персональне AI-відео чи мультфільм із ваших фотографій та історії. Українська студія LUME створює ролик під ключ — вам не потрібно працювати з AI або монтувати.",
    },
    heading: "AI-відео та персональний мультфільм із фотографій на замовлення",
    homeLink: "Як створюємо AI-відео з фотографій на замовлення",
    nav: [
      { id: "story", label: "Кейс" },
      { id: "likeness", label: "Схожість" },
      { id: "brief", label: "Що надіслати" },
      { id: "film", label: "Фільм" },
      { id: "pricing", label: "Вартість" },
      { id: "faq", label: "FAQ" },
    ],
    hero: {
      kicker: "Ваша історія — у мультфільмі",
      lead: "Ви надсилаєте фотографії та розповідаєте свою історію. LUME перетворює їх на готовий персональний мультфільм — під ключ.",
      note: "Без промптів, генераторів і монтажу з вашого боку.",
      order: "Розповісти свою історію",
      photoLabel: "Фото",
      cartoonLabel: "Мультфільм",
      photoAlt: "Реальне фото пари: він у білій сорочці, вона в білій сукні з воланами",
      cartoonAlt: "Та сама пара в мультфільмі LUME — у тих самих образах",
    },
    story: {
      kicker: "Реальний кейс",
      heading: "Історія кохання, яку зберегли в мультфільмі",
      lead: "Пара дозволила показати свої матеріали. Ось увесь шлях — від фотографії до готового фільму.",
      steps: [
        { label: "Реальні люди", caption: "Фото пари", alt: "Пара на піщаному пляжі біля моря" },
        { label: "Персонаж", caption: "Її образ — за цим фото", alt: "Мультяшна героїня в білій кофті й широких джинсах" },
        { label: "Справжній момент", caption: "Освідчення на пляжі", alt: "Відео: хлопець освідчується на пляжі, ставши на коліно" },
        { label: "Сцена", caption: "Той самий момент у мультфільмі", alt: "Відео: сцена освідчення в мультфільмі" },
        { label: "У фільмі", caption: "Сцена стала частиною історії", alt: "Кадр із готового мультфільму: освідчення на заході сонця" },
        { label: "Емоція", caption: "Перший перегляд", alt: "Кадр із відео реакції на мультфільм" },
      ],
    },
    pairs: {
      heading: "З фото — у персонажа",
      lead: "Переносимо те, що робить людей упізнаваними: зачіску, одяг, прикраси, жести. І навіть домашнього улюбленця.",
      photoLabel: "Фото",
      sceneLabel: "У фільмі",
      items: [
        {
          title: "Селфі",
          details: ["голуба сорочка", "хрестик на ланцюжку", "темна водолазка"],
          photoAlt: "Селфі пари: вона в голубій сорочці, він у темній водолазці",
          characterAlt: "Персонажі пари в голубій сорочці та темній водолазці",
          sceneAlt: "Кадр мультфільму: пара грає у приставку вдома",
        },
        {
          title: "Каблучки",
          details: ["підморгування", "жест із каблучкою", "топ на ґудзиках"],
          photoAlt: "Пара показує каблучки за столиком у саду",
          characterAlt: "Персонажі пари: вона підморгує й показує каблучку, він у білій футболці",
          sceneAlt: "Кадр мультфільму: пара гуляє вулицею із собакою",
        },
        {
          title: "Білий образ",
          details: ["сукня з воланами", "біла сорочка", "чорний ремінь"],
          photoAlt: "Пара в білій сорочці та білій сукні з воланами",
          characterAlt: "Персонажі пари в білій сукні з воланами та білій сорочці",
          sceneAlt: "Кадр мультфільму: пара виходить увечері з ресторану",
        },
        {
          title: "Домашній улюбленець",
          details: ["триколірне забарвлення", "біла смуга на морді", "білі лапи"],
          photoAlt: "Триколірне цуценя лежить на траві",
          characterAlt: "Мультяшна версія собаки пари",
          sceneAlt: "Кадр мультфільму: хлопець обіймає собаку",
        },
      ],
    },
    brief: {
      heading: "Що потрібно від вас",
      photosCount: "2–3",
      photosText: "якісні фотографії кожного героя. Обличчя добре видно, бажано — з різних ракурсів.",
      items: [
        "Ваша історія своїми словами — сценарій писати не потрібно",
        "Фото й відео моментів, які хочете відтворити",
        "Настрій: романтичний, веселий, зворушливий, казковий чи максимально наближений до реальності",
        "Особливі побажання: освідчення, привітання, важливі слова чи сюрприз у фіналі",
        "Дата, до якої потрібен мультфільм",
      ],
      note: "Немає готової ідеї? Допоможемо все продумати й підкажемо, як найкраще розповісти вашу історію.",
    },
    likeness: {
      heading: "Як ми зберігаємо схожість",
      sheetAlt: "Аркуш персонажа: героїня в чотирьох ракурсах",
      angles: ["Анфас", "Три чверті", "Профіль", "Спина"],
      points: [
        "Кожного героя опрацьовуємо в кількох ракурсах.",
        "Для різних епізодів — свій образ. У цій історії героїня має чотири.",
        "Переносимо помітні деталі: зачіску, одяг, прикраси, жести.",
        "Персонажем може стати й домашній улюбленець.",
      ],
      looksCaption: "Одна героїня — чотири образи",
      looksAlt: [
        "Героїня в білій кофті та джинсах",
        "Героїня в голубій сорочці",
        "Героїня в топі на ґудзиках",
        "Героїня в білій сукні з воланами",
      ],
      petCaption: "І собака",
      petAlt: "Мультяшна версія собаки пари",
    },
    moment: {
      heading: "Справжній момент → сцена",
      lead: "Освідчення на пляжі — у житті й у мультфільмі.",
      real: "Насправді",
      cartoon: "У мультфільмі",
    },
    film: {
      heading: "Готовий фільм",
      lead: "Фото, образи й справжні моменти — в одній історії.",
      filmCaption: "Мультфільм пари · 2:34",
      reactionHeading: "Перший перегляд",
      reactionCaption: "Реакція на готовий мультфільм",
    },
    compare: {
      heading: "Студія, а не генератор",
      selfTitle: "Самостійно в AI-генераторі",
      self: [
        "Підібрати інструменти",
        "Писати промпти",
        "Стежити, щоб персонажі не змінювалися",
        "Генерувати сцени",
        "Збирати звук",
        "Монтувати",
      ],
      lumeTitle: "З LUME",
      lume: [
        "Ви надсилаєте фото та історію",
        "Студія робить сценарій, персонажів, сцени, анімацію, звук і монтаж",
        "Ви отримуєте готовий фільм",
      ],
    },
    result: {
      heading: "Що ви отримуєте",
      items: [
        "Готовий файл у Full HD",
        "Хронометраж від 1 до 5 хвилин — за тарифом",
        "Правки: від 1 до 3 кіл, залежно від тарифу",
        "Музика в кожному тарифі, озвучення — у SIGNATURE і CINEMA",
      ],
      priceFrom: "від",
      perMinute: "за хвилину",
      compareLink: "Порівняти тарифи",
    },
    faqHeading: "Питання про фото",
    faq: [
      { q: "Скільки фотографій потрібно?", a: "По 2–3 якісні фотографії кожної людини, яка буде в мультфільмі. Бажано, щоб обличчя було добре видно, з різних ракурсів — так персонажі виходять максимально схожими." },
      { q: "Які фотографії краще надіслати?", a: "Ті, де добре видно обличчя, знято з різних ракурсів. Якщо хочете відтворити конкретні події, додайте фото чи відео з них — вони допомагають передати атмосферу, образи героїв, локації та особливі деталі." },
      { q: "Чи підійде селфі?", a: "Так, якщо обличчя добре видно. В історії на цій сторінці один з образів пари створено за селфі. Додайте ще кілька фото з інших ракурсів." },
      { q: "Чи можна відтворити конкретний момент із фото або відео?", a: "Так. Надішліть фото чи відео події, яку хочете бачити в мультфільмі. На цій сторінці — справжнє відео освідчення на пляжі та сцена, яка вийшла з цього моменту." },
      { q: "Чи можна додати домашнього улюбленця?", a: "Так. Надішліть його фото — в історії на цій сторінці персонажем став собака пари." },
      { q: "Чи потрібно самому писати сценарій?", a: "Ні. Поділіться важливими подіями, а ми допоможемо перетворити їх на цілісну історію. Сценарій узгоджуємо з вами перед початком роботи." },
      { q: "Чи можна обрати стиль мультфільму?", a: "Так. Розкажіть, яким уявляєте свій мультфільм: романтичним, веселим, зворушливим, казковим або максимально наближеним до реальності. Можна надіслати приклад анімації, яка вам подобається." },
      { q: "Що відбувається після того, як я надішлю матеріали?", a: "Ми допомагаємо сформувати сюжет, узгоджуємо з вами сценарій, фотографії та всі деталі й починаємо створення. Готовий мультфільм надсилаємо файлом у Full HD на пошту." },
    ],
  },
  en: {
    meta: {
      title: "Personalized AI Video from Photos, Made for You — LUME",
      description: "Turn your photos and real-life story into a personalized AI video or cartoon. Ukrainian studio LUME handles production — no AI tools or editing skills needed.",
    },
    heading: "Personalized AI videos and cartoons from your photos, made for you",
    homeLink: "How we create personalized AI videos from photos",
    nav: [
      { id: "story", label: "The story" },
      { id: "likeness", label: "Likeness" },
      { id: "brief", label: "What to send" },
      { id: "film", label: "The film" },
      { id: "pricing", label: "Pricing" },
      { id: "faq", label: "FAQ" },
    ],
    hero: {
      kicker: "Your story, animated",
      lead: "Send us your photos and tell us your story. LUME turns them into a finished, personalized animated film — start to finish.",
      note: "No prompts, no generators, no editing on your end.",
      order: "Tell us your story",
      photoLabel: "Photo",
      cartoonLabel: "Cartoon",
      photoAlt: "Real photo of the couple: him in a white shirt, her in a white ruffled dress",
      cartoonAlt: "The same couple in a LUME cartoon, wearing the same outfits",
    },
    story: {
      kicker: "A real story",
      heading: "A love story, kept as a cartoon",
      lead: "This couple let us share their materials. Here is the whole journey, from a single photo to the finished film.",
      steps: [
        { label: "Real people", caption: "The couple’s photo", alt: "The couple on a sandy beach by the sea" },
        { label: "Character", caption: "Her look, drawn from that photo", alt: "Cartoon heroine in a white jacket and wide-leg jeans" },
        { label: "The real moment", caption: "A proposal on the beach", alt: "Video: he proposes on one knee on the beach" },
        { label: "The scene", caption: "The same moment, animated", alt: "Video: the proposal scene in the cartoon" },
        { label: "In the film", caption: "Now part of their story", alt: "Still from the finished cartoon: the proposal at sunset" },
        { label: "The reaction", caption: "Watching it for the first time", alt: "Still from the reaction video" },
      ],
    },
    pairs: {
      heading: "From photo to character",
      lead: "We carry over what makes people recognizable: hair, clothes, jewelry, gestures. Even the family pet.",
      photoLabel: "Photo",
      sceneLabel: "In the film",
      items: [
        {
          title: "A selfie",
          details: ["light-blue shirt", "cross necklace", "dark turtleneck"],
          photoAlt: "Selfie of the couple: her in a light-blue shirt, him in a dark turtleneck",
          characterAlt: "The couple’s characters in a light-blue shirt and a dark turtleneck",
          sceneAlt: "Still from the cartoon: the couple playing video games at home",
        },
        {
          title: "The rings",
          details: ["the wink", "showing off the ring", "buttoned top"],
          photoAlt: "The couple showing their rings at a garden table",
          characterAlt: "The couple’s characters: her winking and showing a ring, him in a white T-shirt",
          sceneAlt: "Still from the cartoon: the couple walking down a street with their dog",
        },
        {
          title: "Dressed in white",
          details: ["ruffled hem", "white shirt", "black belt"],
          photoAlt: "The couple in a white shirt and a white ruffled dress",
          characterAlt: "The couple’s characters in a white ruffled dress and a white shirt",
          sceneAlt: "Still from the cartoon: the couple leaving a restaurant in the evening",
        },
        {
          title: "The family dog",
          details: ["tricolor coat", "white blaze", "white paws"],
          photoAlt: "Tricolor puppy lying on the grass",
          characterAlt: "Cartoon version of the couple’s dog",
          sceneAlt: "Still from the cartoon: he hugs the dog",
        },
      ],
    },
    brief: {
      heading: "What we need from you",
      photosCount: "2–3",
      photosText: "good photos of each person. Faces clearly visible, ideally from different angles.",
      items: [
        "Your story in your own words — no script needed",
        "Photos and videos of the moments you want recreated",
        "The mood: romantic, fun, moving, fairy-tale, or as close to real life as possible",
        "Anything special: a proposal, a greeting, words that matter, a surprise at the end",
        "The date you need the film by",
      ],
      note: "No clear idea yet? We’ll help you think it through and find the best way to tell your story.",
    },
    likeness: {
      heading: "How we keep the likeness",
      sheetAlt: "Character sheet: the heroine from four angles",
      angles: ["Front", "Three-quarter", "Profile", "Back"],
      points: [
        "Each person is worked out from several angles.",
        "Different episodes get their own look. In this story, she has four.",
        "Noticeable details carry over: hair, clothes, jewelry, gestures.",
        "Even a pet can become a character.",
      ],
      looksCaption: "One heroine, four looks",
      looksAlt: [
        "The heroine in a white jacket and jeans",
        "The heroine in a light-blue shirt",
        "The heroine in a buttoned top",
        "The heroine in a white ruffled dress",
      ],
      petCaption: "And the dog",
      petAlt: "Cartoon version of the couple’s dog",
    },
    moment: {
      heading: "Real moment → scene",
      lead: "A proposal on the beach, in real life and in the cartoon.",
      real: "In real life",
      cartoon: "In the cartoon",
    },
    film: {
      heading: "The finished film",
      lead: "Photos, looks and real moments, woven into one story.",
      filmCaption: "The couple’s cartoon · 2:34",
      reactionHeading: "The first watch",
      reactionCaption: "Reaction to the finished cartoon",
    },
    compare: {
      heading: "A studio, not a generator",
      selfTitle: "On your own with an AI generator",
      self: [
        "Pick the tools",
        "Write the prompts",
        "Keep the characters consistent",
        "Generate the scenes",
        "Put together the sound",
        "Edit it all",
      ],
      lumeTitle: "With LUME",
      lume: [
        "You send photos and your story",
        "The studio handles the script, characters, scenes, animation, sound and editing",
        "You get a finished film",
      ],
    },
    result: {
      heading: "What you get",
      items: [
        "A finished Full HD file",
        "A length of 1 to 5 minutes, depending on your tier",
        "1 to 3 rounds of revisions, depending on your tier",
        "Music in every tier, voice-over in SIGNATURE and CINEMA",
      ],
      priceFrom: "from",
      perMinute: "per minute",
      compareLink: "Compare tiers",
    },
    faqHeading: "Questions about photos",
    faq: [
      { q: "How many photos do you need?", a: "2–3 good photos of each person who will appear in the film. Faces should be clearly visible, ideally from different angles — that is what makes the characters look like you." },
      { q: "Which photos work best?", a: "Ones where the face is clearly visible, taken from different angles. If you want specific events recreated, add photos or videos of them — they help us capture the atmosphere, the way people look, the places and the small details." },
      { q: "Will a selfie work?", a: "Yes, as long as the face is clearly visible. In the story on this page, one of the couple’s looks was created from a selfie. Add a few photos from other angles too." },
      { q: "Can you recreate a specific moment from a photo or video?", a: "Yes. Send photos or videos of the moment you want in the film. On this page you can see the real video of a beach proposal next to the scene that came from it." },
      { q: "Can our pet be in the film?", a: "Yes. Send us photos of your pet — in the story on this page, the couple’s dog became a character." },
      { q: "Do I need to write the script myself?", a: "No. Share the moments that matter and we’ll help shape them into one story. We agree on the script with you before production begins." },
      { q: "Can I choose the style?", a: "Yes. Tell us how you picture your film: romantic, fun, moving, fairy-tale or as close to real life as possible. You can also send an example of animation you like." },
      { q: "What happens after I send my materials?", a: "We help shape the plot, agree on the script, photos and every detail with you, and then start production. The finished film arrives by email as a Full HD file." },
    ],
  },
};

export function photoVideoFaq(lang: PhotoVideoLang): QA[] {
  return photoVideoContent[lang].faq;
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
