/* ============================================================
   IndexNow: миттєво повідомляє Bing, Yandex та інші пошуковики,
   що сторінки оновилися, — замість чекати наступного обходу.

   Запускати ПІСЛЯ деплою (файл-ключ має бути вже доступний на сайті):
     npm run indexnow                      — головні сторінки, кейс і гайд
     npm run indexnow -- /privacy /en      — лише вказані шляхи

   Ключ лежить у public/indexnow.txt і віддається за адресою
   https://www.lume.kyiv.ua/indexnow.txt (proxy.ts його не чіпає).
   ============================================================ */

import { readFileSync } from "node:fs";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.lume.kyiv.ua").replace(/\/$/, "");
const KEY = readFileSync(new URL("../public/indexnow.txt", import.meta.url), "utf8").trim();

const DEFAULT_PATHS = [
  "/",
  "/en",
  "/ai-video-from-photos",
  "/en/ai-video-from-photos",
  "/how-to-make-a-cartoon-from-photos",
  "/en/how-to-make-a-cartoon-from-photos",
];
const paths = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_PATHS;

const body = {
  host: new URL(SITE).host,
  key: KEY,
  keyLocation: `${SITE}/indexnow.txt`,
  urlList: paths.map((p) => SITE + (p === "/" ? "/" : p)),
};

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});

// 200 / 202 — прийнято; 403 — ключ не знайдено на сайті; 422 — URL не з цього хоста.
console.log(`IndexNow: ${res.status} ${res.statusText}`);
body.urlList.forEach((u) => console.log("  ", u));
if (!res.ok) process.exit(1);
