import { cookies, headers } from "next/headers";
import { appendLead, SHEET_CONFIGURED } from "../../../lib/sheet";
import { dayKey, getCount, increment } from "../../../lib/generation-store";

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
    source: String(body.source ?? "").slice(0, 40),
    utm,
    // Куки Meta: дають звʼязати заявку з рекламним кліком у звітах.
    fbp: cookie("_fbp"),
    fbc: cookie("_fbc"),
    referrer: String(body.referrer ?? "").slice(0, 300),
    userAgent: (headerList.get("user-agent") ?? "").slice(0, 300),
  };

  const delivery = await appendLead(row);
  if (!delivery.ok) {
    // Номер усе одно не губимо: лишається в логах, звідки його можна дістати.
    console.error("[lead] sheet write failed:", delivery.reason, JSON.stringify(row));
    return Response.json({ error: "storage", stored: false }, { status: 502 });
  }

  console.info(`[lead] ok · ${phone} · ${row.source}`);
  return Response.json({ ok: true });
}

/** Чи налаштована таблиця — щоб не показувати форму, яка нікуди не пише. */
export function GET() {
  return Response.json({ enabled: SHEET_CONFIGURED });
}
