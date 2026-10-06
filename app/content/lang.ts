/* ============================================================
   Мова сайту.

   Українська живе в корені ("/"), англійська — під "/en",
   російська — під "/ru".

   За країною вибираємо лише між українською та англійською:
   російську відвідувач вмикає сам перемикачем, автоматично на неї
   не переводимо нікого.
   Мова НЕ звʼязана з валютою: валюту й далі визначає Location
   Observer за країною (UA → UAH, решта → EUR), тож киянин може
   читати сайт англійською й бачити гривні.
   ============================================================ */

export const LANGS = ["uk", "en", "ru"] as const;

export type Lang = (typeof LANGS)[number];

/** Мова кореневих шляхів. Український ринок — основний. */
export const DEFAULT_LANG: Lang = "uk";

/**
 * Мови, які показуємо публічно: перемикач, hreflang, карта сайту.
 *
 * Російська сторінка лишається робочою за прямим посиланням /ru (щоб не
 * ламати вже надіслані лінки й куки тих, хто її колись обрав), але її
 * немає ні в перемикачі, ні в індексі пошуку. Щоб повернути — додати
 * "ru" сюди.
 */
export const PUBLIC_LANGS: readonly Lang[] = ["uk", "en"];

/** Чи показуємо цю мову публічно. */
export function isPublicLang(lang: Lang): boolean {
  return PUBLIC_LANGS.includes(lang);
}

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
