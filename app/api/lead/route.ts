import { cookies, headers } from "next/headers";
import { appendLead, SHEET_CONFIGURED } from "../../../lib/sheet";
import { dayKey, getCount, increment } from "../../../lib/generation-store";
import { deliverToN8n } from "../../../lib/n8n";
import { getVisitorLocation } from "../../location";
import { priceFor, songPrice, TIERS } from "../../pricing";

/** Час для повідомлення в групі: «пт, 16.10.2026, 18:42» за Києвом. */
const kyivTime = new Intl.DateTimeFormat("uk-UA", {
  timeZone: "Europe/Kyiv",
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Телефон: цифри, пробіли, дужки, дефіси й «+». Рахуємо саме цифри. */
function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 15) return null;
  return raw.trim().startsWith("+") ? `+${digits}` : digits.length === 10 && digits.startsWith("0")
    ? `+38${digits}` // звичний запис 0XX... з України
    : `+${digits}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Vercel кодує місто в URL-форматі ("Kyiv", "S%C3%A3o%20Paulo"). */
function geoHeader(list: Headers, name: string): string {
  const raw = list.get(name) ?? "";
  try {
    return decodeURIComponent(raw).slice(0, 80);
  } catch {
    return raw.slice(0, 80);
  }
}

/**
 * Вибір з анкети. Довіряємо лише тому, що можна перевірити: тариф і
 * хвилини мають існувати, а суму рахуємо самі за pricing.ts — у тій
 * валюті, яку відвідувач бачив на сторінці.
 */
async function readOrder(body: Record<string, unknown>) {
  const tier = TIERS.find((t) => t.slug === body.tier);
  const minutes = typeof body.minutes === "number" ? body.minutes : NaN;
  const { currency } = await getVisitorLocation();
  const base = tier ? priceFor(tier, minutes, currency) : 0;
  if (!tier || !base) return null;

  const song = body.song === true && !tier.songIncluded;
  return {
    tier: tier.name,
    minutes,
    song: song || Boolean(tier.songIncluded),
    total: base + (song ? songPrice(currency) : 0),
    currency,
  };
}

const MESSENGER_LABEL: Record<string, string> = { telegram: "Telegram", whatsapp: "WhatsApp" };

/**
 * Готовий текст для групи продажів у Telegram (HTML-розмітка бота).
 * n8n шле його як є — шаблон у воркфлоу не треба правити під кожне нове
 * поле: {{ $json.body.message }} з parse_mode = HTML.
 */
function leadMessage(p: {
  phone: string;
  email: string;
  messenger: string;
  tier: string;
  minutes: number | null;
  song: boolean;
  total: number | null;
  currency: string;
  offer: boolean;
  source: string;
  country: string;
  region: string;
  city: string;
  timeZone: string;
  lang: string;
  device: string;
  utm: Record<string, string>;
  createdAtKyiv: string;
}): string {
  const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const money =
    p.total != null
      ? new Intl.NumberFormat("uk-UA", { style: "currency", currency: p.currency, maximumFractionDigits: 0 }).format(p.total)
      : "";
  const place = [p.city, p.region, p.country].filter(Boolean).join(", ");
  const ad = [p.utm.utm_source, p.utm.utm_campaign].filter(Boolean).join(" / ");

  // null — поля немає (рядок пропускаємо), "" — навмисний порожній рядок-розділювач.
  const lines: (string | null)[] = [
    p.tier ? "🎬 <b>Нова заявка з анкети</b>" : "📞 <b>Нова заявка</b>",
    "",
    `📱 <b>${esc(p.phone)}</b>`,
    p.messenger ? `💬 Пише в: <b>${MESSENGER_LABEL[p.messenger] ?? esc(p.messenger)}</b>` : null,
    p.email ? `✉️ ${esc(p.email)}` : null,
    p.tier ? "" : null,
    p.tier ? `🎞 Тариф: <b>${esc(p.tier)}</b> · ${p.minutes} хв${p.song ? " · пісня ✓" : ""}` : null,
    money ? `💰 Сума: <b>${money}</b>` : null,
    p.offer ? "🎁 Встиг за таймером — <b>сценарій у подарунок</b>" : null,
    "",
    place ? `📍 ${esc(place)}${p.timeZone ? ` (${esc(p.timeZone)})` : ""}` : null,
    `🌐 Мова: ${esc(p.lang || "—")} · ${p.device} · ${esc(p.source || "—")}`,
    ad ? `📣 ${esc(ad)}` : null,
    `🕒 ${p.createdAtKyiv}`,
  ];
  return lines
    .filter((l): l is string => l !== null)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Скільки заявок приймаємо з однієї IP за добу — захист від спаму. */
const LEADS_PER_IP_PER_DAY = 20;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  const phone = normalizePhone(typeof body.phone === "string" ? body.phone : "");
  if (!phone) return Response.json({ error: "bad-phone" }, { status: 400 });

  // E-mail необовʼязковий; кривий не валить заявку — просто не пишемо його.
  const emailRaw = typeof body.email === "string" ? body.email.trim().slice(0, 200) : "";
  const email = EMAIL_RE.test(emailRaw) ? emailRaw : "";
  const messenger =
    body.messenger === "telegram" || body.messenger === "whatsapp" ? body.messenger : "";
  const order = await readOrder(body);

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "local";

  if (ip !== "local") {
    const key = `lume:lead:ip:${ip}:${dayKey()}`;
    if ((await getCount(key)) >= LEADS_PER_IP_PER_DAY) {
      return Response.json({ error: "too-many" }, { status: 429 });
    }
    await increment(key, 60 * 60 * 24);
  }

  const jar = await cookies();
  const cookie = (name: string) => jar.get(name)?.value ?? "";

  const utmRaw = body.utm;
  const utm =
    utmRaw && typeof utmRaw === "object"
      ? Object.fromEntries(
          Object.entries(utmRaw as Record<string, unknown>)
            .filter(([, v]) => typeof v === "string" && v)
            .map(([k, v]) => [k, String(v).slice(0, 200)]),
        )
      : {};

  const row = {
    createdAt: new Date().toISOString(),
    phone,
    lang: cookie("lume_lang") || String(body.lang ?? ""),
    page: String(body.page ?? "").slice(0, 300),
    country: headerList.get("x-vercel-ip-country") ?? "",
    region: geoHeader(headerList, "x-vercel-ip-country-region"),
    city: geoHeader(headerList, "x-vercel-ip-city"),
    timeZone: String(body.timeZone ?? "").slice(0, 60),
    source: String(body.source ?? "").slice(0, 40),
    email,
    messenger,
    tier: order?.tier ?? "",
    minutes: order?.minutes ?? null,
    song: order?.song ?? false,
    total: order?.total ?? null,
    currency: order?.currency ?? "",
    offer: body.offer === true,
    utm,
    // Куки Meta: дають звʼязати заявку з рекламним кліком у звітах.
    fbp: cookie("_fbp"),
    fbc: cookie("_fbc"),
    referrer: String(body.referrer ?? "").slice(0, 300),
    userAgent: (headerList.get("user-agent") ?? "").slice(0, 300),
  };

  const now = new Date(row.createdAt);
  const payload = {
    event: "lume.lead.created" as const,
    leadId: crypto.randomUUID(),
    phone,
    source: row.source,
    page: row.page,
    lang: row.lang,
    // Локація: країна, регіон і місто — з гео Vercel, часовий пояс — з браузера.
    country: row.country,
    region: row.region,
    city: row.city,
    timeZone: row.timeZone,
    // Анкета (source: "quiz"); для інших джерел поля порожні.
    email: row.email,
    messenger: row.messenger,
    tier: row.tier,
    minutes: row.minutes,
    song: row.song,
    total: row.total,
    currency: row.currency,
    offer: row.offer,
    utm,
    referrer: row.referrer,
    device: /Mobi|Android|iPhone|iPad/i.test(row.userAgent) ? "mobile" : "desktop",
    createdAt: row.createdAt,
    createdAtKyiv: kyivTime.format(now),
  };
  const message = leadMessage({ ...row, device: payload.device, createdAtKyiv: payload.createdAtKyiv });

  /* Головний канал — n8n: бот пише номер у групу продажів. Таблиця —
     необовʼязкова копія, її збій заявку не валить. */
  const [delivery, sheet] = await Promise.all([
    deliverToN8n({ ...payload, message }),
    SHEET_CONFIGURED ? appendLead(row) : Promise.resolve(null),
  ]);

  if (sheet && !sheet.ok) {
    console.error("[lead] sheet write failed:", sheet.reason);
  }

  if (!delivery.ok) {
    // Номер не губимо: лишається в логах, звідки його можна дістати.
    console.error("[lead] n8n delivery failed:", delivery.reason, JSON.stringify(row));
    return Response.json({ error: "storage" }, { status: 502 });
  }

  console.info(`[lead] ok · ${phone} · ${row.source}`);
  return Response.json({ ok: true });
}

/** Чи налаштована таблиця — щоб не показувати форму, яка нікуди не пише. */
export function GET() {
  return Response.json({ enabled: SHEET_CONFIGURED });
}
