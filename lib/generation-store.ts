/* ============================================================
   Облік генерацій: хто вже пробував і скільки витрачено за місяць.

   Сховище — Upstash / Vercel KV, якщо задані KV_REST_API_URL і
   KV_REST_API_TOKEN. Якщо їх немає (локальна розробка або ще не
   підключили) — памʼять процесу.

   Памʼять чесно має бути названа тимчасовою: на Vercel кожен холодний
   старт обнуляє лічильники, тож без KV ліміти працюють приблизно, а
   справжній стоп-кран — ліміт витрат у кабінеті OpenAI.
   ============================================================ */

import "server-only";

const KV_URL = process.env.KV_REST_API_URL?.trim();
const KV_TOKEN = process.env.KV_REST_API_TOKEN?.trim();

export const STORE_KIND: "kv" | "memory" = KV_URL && KV_TOKEN ? "kv" : "memory";

/** Запасне сховище: живе рівно стільки, скільки живе процес. */
const memory = new Map<string, { value: number; expiresAt: number }>();

function readMemory(key: string): number {
  const row = memory.get(key);
  if (!row) return 0;
  if (row.expiresAt < Date.now()) {
    memory.delete(key);
    return 0;
  }
  return row.value;
}

async function kv(command: unknown[]): Promise<unknown> {
  const response = await fetch(`${KV_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`KV ${response.status}`);
  const json = (await response.json()) as { result?: unknown };
  return json.result;
}

/** Поточне значення лічильника. */
export async function getCount(key: string): Promise<number> {
  if (STORE_KIND === "memory") return readMemory(key);
  try {
    const result = await kv(["GET", key]);
    return result == null ? 0 : Number(result) || 0;
  } catch {
    // Сховище недоступне — не блокуємо користувача, але й не вдаємо,
    // що лічильник працює: про це пише лог у маршруті.
    return 0;
  }
}

/** Збільшує лічильник і повертає нове значення. ttlSeconds ставиться
 *  лише при створенні ключа. */
export async function increment(key: string, ttlSeconds: number): Promise<number> {
  if (STORE_KIND === "memory") {
    const current = readMemory(key);
    const next = current + 1;
    const row = memory.get(key);
    memory.set(key, {
      value: next,
      expiresAt: row && row.expiresAt > Date.now() ? row.expiresAt : Date.now() + ttlSeconds * 1000,
    });
    return next;
  }
  try {
    const next = Number(await kv(["INCR", key])) || 1;
    if (next === 1) await kv(["EXPIRE", key, String(ttlSeconds)]);
    return next;
  } catch {
    return 0;
  }
}

/** Ключ місяця у форматі 2026-10 — лічильник сам «обнуляється» з новим місяцем. */
export function monthKey(now = new Date()): string {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** Ключ доби у форматі 2026-10-07. */
export function dayKey(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}
