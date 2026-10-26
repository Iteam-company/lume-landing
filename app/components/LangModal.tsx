"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  LANG_COOKIE,
  langPath,
  splitLangPath,
  SWITCHER_LANGS,
  type Lang,
} from "../content/lang";
import { rememberLang } from "../content/remember-lang";

/** Назву мови пишемо самою мовою: людина шукає очима свою. */
const NAMES: Record<Lang, string> = { uk: "Українська", ru: "Русский", en: "English" };

const BOT_RE = /bot|crawler|spider|crawling|lighthouse|headless|preview/i;

function hasChosen(): boolean {
  return document.cookie.split("; ").some((c) => c.startsWith(`${LANG_COOKIE}=`));
}

/**
 * Вибір мови при першому візиті.
 *
 * Показується, доки немає куки lume_lang — тобто лише раз: будь-який
 * вибір (тут або в перемикачі) її ставить. Роботам вікно не показуємо,
 * щоб воно не потрапило в знімки сторінки й прев'ю.
 *
 * Мову, на яку вже привело гео (proxy.ts), підсвічуємо — для більшості
 * це один клік. Перехід на іншу мову — повним перезавантаженням, як і в
 * LangSwitch: інакше <html lang> лишився б від попередньої.
 */
export default function LangModal({ lang }: { lang: Lang }) {
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (hasChosen() || BOT_RE.test(navigator.userAgent)) return;
    ref.current?.showModal();
  }, []);

  function choose(next: Lang) {
    rememberLang(next);
    if (next === lang) {
      ref.current?.close();
      return;
    }
    const { path } = splitLangPath(pathname ?? "/");
    window.location.assign(langPath(path, next) + window.location.search + window.location.hash);
  }

  return (
    <dialog
      ref={ref}
      className="langpick"
      aria-labelledby="langpick-title"
      // Закрили без вибору (Esc) — лишаємо поточну мову й більше не питаємо.
      onCancel={() => rememberLang(lang)}
    >
      <div className="langpick__card">
        <span className="logo__text langpick__logo">LUME</span>
        <h2 id="langpick-title" className="langpick__title">
          Оберіть мову · Выберите язык · Choose language
        </h2>
        <div className="langpick__list">
          {SWITCHER_LANGS.map((code) => (
            <button
              key={code}
              type="button"
              lang={code}
              className={`langpick__btn${code === lang ? " is-current" : ""}`}
              // Фокус — на вже підсвіченій мові, а не на першій у списку.
              autoFocus={code === lang}
              onClick={() => choose(code)}
            >
              {NAMES[code]}
            </button>
          ))}
        </div>
      </div>
    </dialog>
  );
}
