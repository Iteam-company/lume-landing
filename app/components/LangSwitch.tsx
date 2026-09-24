"use client";

import { usePathname } from "next/navigation";
import { langPath, splitLangPath, type Lang } from "../content/lang";
import { rememberLang } from "../content/remember-lang";

const LABELS: Record<Lang, string> = { uk: "UA", en: "EN", ru: "RU" };

/**
 * Перемикач мови.
 *
 * Вибір записуємо в куку: після нього гео більше не перекидає людину
 * на іншу мову (логіка в proxy.ts).
 *
 * Перехід — навмисно повним перезавантаженням, а не м'якою навігацією
 * Next. Кореневий layout один на обидві мови, і при м'якій навігації
 * він не перерендериться: атрибут <html lang> лишився б від попередньої
 * мови, а це те, за чим орієнтуються екранні читачки й переклад у
 * браузері.
 */
export default function LangSwitch({ lang }: { lang: Lang }) {
  const pathname = usePathname();

  function choose(next: Lang) {
    if (next === lang) return;
    rememberLang(next);
    const { path } = splitLangPath(pathname ?? "/");
    window.location.assign(langPath(path, next));
  }

  return (
    <span className="lang" role="group" aria-label="Language">
      {(Object.keys(LABELS) as Lang[]).map((code) => (
        <button
          key={code}
          type="button"
          className={`lang__btn${code === lang ? " is-active" : ""}`}
          aria-pressed={code === lang}
          onClick={() => choose(code)}
        >
          {LABELS[code]}
        </button>
      ))}
    </span>
  );
}
