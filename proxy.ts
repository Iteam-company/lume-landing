import { NextResponse, type NextRequest } from "next/server";
import {
  isLang,
  LANG_COOKIE,
  LANG_HEADER,
  langPath,
  splitLangPath,
} from "./app/content/lang";

/* ============================================================
   Вибір мови за регіоном.

   Україна → українська версія в корені, решта світу → /en.
   Російську автоматично не вмикаємо нікому: на неї переходять лише
   перемикачем або прямим посиланням /ru.

   Вибір відвідувача (кука lume_lang) сильніший за гео: якщо людина
   натиснула перемикач, більше її нікуди не перекидає.

   Пошукові роботи НЕ перенаправляємо. Googlebot ходить переважно з
   американських IP; якби ми його редиректили, українська сторінка в
   корені — та, під яку зроблено все SEO, — не потрапила б до індексу.
   Кожна адреса віддає всім однаковий вміст, це не клоакінг: ми лише
   не вгадуємо мову за робота.
   ============================================================ */

const GEO_HEADER = "x-vercel-ip-country";

const CRAWLER_RE =
  /bot|crawler|spider|crawling|slurp|facebookexternalhit|telegram|whatsapp|preview|embedly|quora|pinterest|vkshare|lighthouse|chatgpt-user|claude-user|perplexity-user|mistralai-user|meta-externalfetcher|anthropic-ai|cohere-ai/i;

export function proxy(request: NextRequest) {
  const { lang, path } = splitLangPath(request.nextUrl.pathname);

  /* Адреса з мовним префіксом ("/en", "/ru/privacy") — це явний намір:
     її віддаємо як є, інакше посилання на переклад перекидало б людину
     назад. Вибираємо мову лише для безпрефіксних українських шляхів. */
  if (lang === "uk") {
    const cookie = request.cookies.get(LANG_COOKIE)?.value;
    const crawler = CRAWLER_RE.test(request.headers.get("user-agent") ?? "");

    const wanted = isLang(cookie)
      ? cookie
      : crawler
        ? "uk" // робот отримує саме ту адресу, яку попросив
        : request.headers.get(GEO_HEADER)?.toUpperCase() === "UA"
          ? "uk"
          : "en";

    if (wanted !== lang) {
      const url = request.nextUrl.clone();
      url.pathname = langPath(path, wanted);
      return NextResponse.redirect(url);
    }
  }

  // Мова сторінки для layout: з неї береться <html lang> і метадані.
  const headers = new Headers(request.headers);
  headers.set(LANG_HEADER, lang);

  const response = NextResponse.next({ request: { headers } });
  // Відповідь залежить від куки з вибором мови — кешам це треба знати.
  response.headers.set("Vary", "Cookie");
  return response;
}

export const config = {
  matcher: [
    /* Усі сторінки, крім статики, API та службових файлів пошуку. */
    "/((?!_next/|api/|video/|favicon|icon|robots.txt|sitemap.xml|llms.txt|indexnow.txt|logo.png).*)",
  ],
};
