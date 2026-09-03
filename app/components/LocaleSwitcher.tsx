"use client";

import { Fragment, type MouseEvent } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from "../i18n/config";

const LABELS: Record<Locale, string> = { uk: "UK", en: "EN" };

/** Рік у секундах — строк життя cookie з ручним вибором мови. */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Перемикач мови UK / EN.
 *
 * Ручний вибір:
 *  - пише cookie `lume_locale` (її читає лише proxy.ts для беспрефіксних шляхів);
 *  - перемикає /uk/... ↔ /en/..., зберігаючи поточний path;
 *  - query і hash зберігаються при кліку (читаються з window.location).
 *
 * `href` будується лише з pathname — тому компонент рендериться в SSR
 * (без useSearchParams і без Suspense) і працює навіть без JS.
 */
export default function LocaleSwitcher() {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  const rawLang = typeof params.lang === "string" ? params.lang : undefined;
  const current: Locale = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;

  function pathFor(target: Locale): string {
    const segments = (pathname || "/").split("/");
    // segments[0] === "" (провідний слеш)
    if (isLocale(segments[1])) {
      segments[1] = target;
    } else {
      segments.splice(1, 0, target);
    }
    return segments.join("/") || `/${target}`;
  }

  function onSelect(target: Locale) {
    return (event: MouseEvent<HTMLAnchorElement>) => {
      if (target === current) {
        event.preventDefault();
        return;
      }
      // модифіковані кліки / середня кнопка — лишаємо браузеру
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }
      event.preventDefault();
      document.cookie = `lume_locale=${target}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
      const { search, hash } = window.location;
      router.push(pathFor(target) + search + hash);
    };
  }

  return (
    <div className="locale-switcher" role="group" aria-label="Language / Мова">
      {LOCALES.map((locale, i) => (
        <Fragment key={locale}>
          {i > 0 && <span className="locale-switcher__sep" aria-hidden="true" />}
          <a
            href={pathFor(locale)}
            hrefLang={locale}
            aria-current={locale === current ? "true" : undefined}
            className={`locale-switcher__opt${locale === current ? " is-active" : ""}`}
            onClick={onSelect(locale)}
          >
            {LABELS[locale]}
          </a>
        </Fragment>
      ))}
    </div>
  );
}
