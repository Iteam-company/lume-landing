import { randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import {
  ACCEPTED_TYPES,
  ATTEMPTS_PER_IP_PER_DAY,
  ATTEMPTS_PER_VISITOR,
  buildPrompt,
  GENERATIONS_PER_MONTH,
  IMAGE_MODEL,
  IMAGE_QUALITY,
  isSizeKey,
  MAX_FILE_BYTES,
  MAX_PHOTOS,
  normalizePeople,
  SIZES,
} from "../../character";
import {
  dayKey,
  getCount,
  increment,
  monthKey,
  STORE_KIND,
} from "../../../lib/generation-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/* Генерація триває довше за типові 10 секунд. */
export const maxDuration = 120;

/** Кука з ідентифікатором відвідувача. httpOnly: з браузера не підробиш. */
const VISITOR_COOKIE = "lume_visitor";
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const OPENAI_URL = "https://api.openai.com/v1/images/edits";

type Reason =
  | "no-key"
  | "no-photos"
  | "too-many"
  | "bad-type"
  | "too-large"
  | "visitor-limit"
  | "ip-limit"
  | "budget"
  | "upstream"
  | "timeout";

function fail(reason: Reason, status: number) {
  return Response.json({ error: reason }, { status });
}

export async function POST(request: Request) {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return fail("no-key", 503);

  /* ---------- хто це ---------- */
  const jar = await cookies();
  let visitorId = jar.get(VISITOR_COOKIE)?.value;
  const isNewVisitor = !visitorId;
  if (!visitorId) visitorId = randomUUID();

  const headerList = await headers();
  // Vercel ставить x-forwarded-for; локально його немає — тоді ліміт по IP
  // просто не працює, і це нормально.
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "local";

  /* ---------- ліміти ---------- */
  const visitorKey = `lume:char:visitor:${visitorId}`;
  const ipKey = `lume:char:ip:${ip}:${dayKey()}`;
  const monthlyKey = `lume:char:month:${monthKey()}`;

  const [used, usedByIp, usedThisMonth] = await Promise.all([
    getCount(visitorKey),
    getCount(ipKey),
    getCount(monthlyKey),
  ]);

  if (used >= ATTEMPTS_PER_VISITOR) return fail("visitor-limit", 429);
  if (ip !== "local" && usedByIp >= ATTEMPTS_PER_IP_PER_DAY) return fail("ip-limit", 429);
  if (usedThisMonth >= GENERATIONS_PER_MONTH) return fail("budget", 503);

  /* ---------- що прислали ---------- */
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("no-photos", 400);
  }

  const photos = form.getAll("photos").filter((v): v is File => v instanceof File);
  if (photos.length === 0) return fail("no-photos", 400);
  if (photos.length > MAX_PHOTOS) return fail("too-many", 400);

  for (const photo of photos) {
    if (!ACCEPTED_TYPES.includes(photo.type)) return fail("bad-type", 415);
    if (photo.size > MAX_FILE_BYTES) return fail("too-large", 413);
  }

  const people = normalizePeople(form.get("people"));
  const sizeInput = form.get("size");
  const size = isSizeKey(sizeInput) ? SIZES[sizeInput] : SIZES.square;

  /* ---------- генерація ---------- */
  const upstream = new FormData();
  upstream.set("model", IMAGE_MODEL);
  upstream.set("prompt", buildPrompt(people));
  upstream.set("size", size);
  upstream.set("quality", IMAGE_QUALITY);
  upstream.set("n", "1");
  for (const photo of photos) upstream.append("image[]", photo, photo.name || "photo.jpg");

  // Лічильники піднімаємо ДО запиту: краще втратити одну спробу через
  // помилку мережі, ніж дати обійти бюджет повторними запитами.
  await Promise.all([
    increment(visitorKey, VISITOR_COOKIE_MAX_AGE),
    ip === "local" ? Promise.resolve(0) : increment(ipKey, 60 * 60 * 24),
    increment(monthlyKey, 60 * 60 * 24 * 40),
  ]);

  let response: Response;
  try {
    response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body: upstream,
      signal: AbortSignal.timeout(110_000),
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    console.error("[character] request failed:", error);
    return fail(timedOut ? "timeout" : "upstream", 504);
  }

  if (!response.ok) {
    // Тіло відповіді OpenAI може містити службові подробиці — у лог, не клієнту.
    const body = await response.text();
    console.error("[character] openai", response.status, body);

    /* Вичерпані кошти або ліміт запитів на стороні OpenAI — для
       відвідувача це те саме, що наш місячний ліміт: сьогодні не вийде,
       але є чат. Деталей білінгу назовні не віддаємо. */
    const outOfCredit =
      response.status === 429 || body.includes("insufficient_quota");
    return fail(outOfCredit ? "budget" : "upstream", outOfCredit ? 503 : 502);
  }

  const payload = (await response.json()) as {
    data?: { b64_json?: string }[];
    usage?: Record<string, unknown>;
  };
  const image = payload.data?.[0]?.b64_json;
  if (!image) {
    console.error("[character] empty response from openai");
    return fail("upstream", 502);
  }

  console.info(
    `[character] ok · people=${people} · store=${STORE_KIND} · month=${usedThisMonth + 1}/${GENERATIONS_PER_MONTH} · usage=${JSON.stringify(payload.usage ?? {})}`,
  );

  const result = Response.json({ image: `data:image/png;base64,${image}` });
  if (isNewVisitor) {
    result.headers.append(
      "Set-Cookie",
      `${VISITOR_COOKIE}=${visitorId}; Path=/; Max-Age=${VISITOR_COOKIE_MAX_AGE}; HttpOnly; SameSite=Lax${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`,
    );
  }
  return result;
}

/** Чи вже витрачена спроба — щоб секція одразу показала правильний стан. */
export async function GET() {
  const jar = await cookies();
  const visitorId = jar.get(VISITOR_COOKIE)?.value;
  const used = visitorId ? await getCount(`lume:char:visitor:${visitorId}`) : 0;
  const month = await getCount(`lume:char:month:${monthKey()}`);

  return Response.json({
    enabled: Boolean(process.env.OPENAI_API_KEY?.trim()),
    used: used >= ATTEMPTS_PER_VISITOR,
    budgetLeft: Math.max(0, GENERATIONS_PER_MONTH - month),
  });
}
