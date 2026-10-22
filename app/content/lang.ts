/* ============================================================
   Мова сайту.

   Українська живе в корені ("/"), англійська — під "/en",
   російська — під "/ru".

   За країною вибираємо лише між українською та англійською.
   Російська — для пошуку: її індексують і показують у видачі на
   російськомовні запити, але в перемикачі її немає і автоматично
   на неї не переводимо нікого.
   Мова НЕ звʼязана з валютою: валюту й далі визначає Location
   Observer за країною (UA → UAH, решта → EUR), тож киянин може
   читати сайт англійською й бачити гривні.
   ============================================================ */

export const LANGS = ["uk", "en", "ru"] as const;

export type Lang = (typeof LANGS)[number];

/** Мова кореневих шляхів. Український ринок — основний. */
export const DEFAULT_LANG: Lang = "uk";

/**
 * Мови в перемикачі. Російської тут немає навмисно: обрати її в
 * інтерфейсі не можна, на /ru приходять лише з пошуку або за посиланням.
 */
export const SWITCHER_LANGS: readonly Lang[] = ["uk", "en"];

/** Мови, які віддаємо пошуку: карта сайту, hreflang, індексація. */
export const INDEXED_LANGS: readonly Lang[] = ["uk", "en", "ru"];

/** Куди проксі кладе визначену мову для layout. */
export const LANG_HEADER = "x-lume-lang";

/** Вибір відвідувача переважає над гео. Рік — щоб не питати щоразу. */
export const LANG_COOKIE = "lume_lang";
export const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Префікс у шляху для кожної мови ("" для української). */
const PREFIX: Record<Lang, string> = { uk: "", en: "/en", ru: "/ru" };

export const LANG_BCP47: Record<Lang, string> = {
  uk: "uk-UA",
  en: "en-US",
  ru: "ru-RU",
};
/**
 * Код для hreflang. Російська — без регіону: ця версія для всіх, хто
 * шукає російською (в Україні й за кордоном), а не для ринку Росії.
 * LANG_BCP47 лишаємо "ru-RU" — під нього форматуються числа ("2 800 ₴").
 */
const HREFLANG = { uk: "uk-UA", en: "en-US", ru: "ru" } as const satisfies Record<Lang, string>;

export const LANG_OG: Record<Lang, string> = {
  uk: "uk_UA",
  en: "en_US",
  ru: "ru_RU",
};

export function isLang(value: string | null | undefined): value is Lang {
  return value != null && (LANGS as readonly string[]).includes(value);
}

/**
 * Шлях без мовного префікса: "/en/privacy" → "/privacy", "/ru" → "/".
 * Мову теж повертаємо, щоб проксі не розбирав шлях двічі.
 */
export function splitLangPath(pathname: string): { lang: Lang; path: string } {
  for (const lang of LANGS) {
    const prefix = PREFIX[lang];
    if (!prefix) continue;
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return { lang, path: pathname.slice(prefix.length) || "/" };
    }
  }
  return { lang: "uk", path: pathname || "/" };
}

/** Той самий шлях іншою мовою: ("/privacy", "en") → "/en/privacy". */
export function langPath(path: string, lang: Lang): string {
  const clean = path === "/" ? "" : path;
  return `${PREFIX[lang]}${clean}` || "/";
}

/**
 * hreflang для сторінки: усі мови з INDEXED_LANGS плюс x-default на
 * українську. Однаковий набір на кожній мовній версії — пошук вимагає,
 * щоб посилання були взаємними. `base` — для абсолютних адрес у sitemap.
 */
export function languageAlternates(path: string, base = "") {
  const entries = INDEXED_LANGS.map((lang) => [HREFLANG[lang], base + langPath(path, lang)]);
  return Object.fromEntries([...entries, ["x-default", base + langPath(path, DEFAULT_LANG)]]);
}
