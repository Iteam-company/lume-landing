import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";

/* Явно відкриваємо сайт не лише для пошукових роботів, а й для краулерів
   AI-асистентів — без цього ChatGPT, Claude чи Perplexity не зможуть
   прочитати сторінку і порекомендувати послугу. */
/* Два типи роботів, обидва потрібні:
   — навчальні (GPTBot, ClaudeBot, Google-Extended) читають сайт про запас,
     ефект повільний;
   — «користувацькі» (ChatGPT-User, Perplexity-User, Claude-User,
     MistralAI-User, Meta-ExternalFetcher) заходять у момент, коли людина
     щось питає, і саме вони дають згадку з посиланням у відповіді. */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "meta-externalagent",
  "Amazonbot",
  "YandexBot",
  "DuckAssistBot",
  "cohere-ai",
  "Bytespider",
  "Meta-ExternalFetcher",
  "Google-CloudVertexBot",
  "MistralAI-User",
];

/* Прев'ю посилань у соцмережах і месенджерах: без доступу картка
   показується голим текстом. */
const PREVIEW_BOTS = ["FacebookBot", "facebookexternalhit", "Twitterbot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
      ...PREVIEW_BOTS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
