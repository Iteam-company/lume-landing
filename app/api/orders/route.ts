import { isMinutes, isTierSlug } from "../../paddle";
import { priceFor, TIERS } from "../../pricing";
import { getVisitorLocation } from "../../location";
import { deliverToN8n } from "../../../lib/n8n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Нік у Telegram: латиниця, цифри й «_», 4-32 символи, «@» необовʼязкове. */
const TELEGRAM_RE = /^@?[A-Za-z0-9_]{4,32}$/;

function badRequest(error: string) {
  return Response.json({ error }, { status: 400 });
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return badRequest("Некоректний формат запиту");
  }
  if (typeof raw !== "object" || raw === null) {
    return badRequest("Некоректний формат запиту");
  }

  const body = raw as Record<string, unknown>;

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const telegram = typeof body.telegram === "string" ? body.telegram.trim() : "";

  if (!name) return badRequest("Вкажіть імʼя");
  // Telegram — єдиний канал звʼязку, тому поле обовʼязкове.
  if (!TELEGRAM_RE.test(telegram.replace(/^https?:\/\/t\.me\//i, ""))) {
    return badRequest("Вкажіть нік у Telegram");
  }

  // Валюту не приймаємо від клієнта: сервер сам визначає її за trusted
  // Vercel Geo (x-vercel-ip-country) — так само, як і суму нижче.
  const { currency } = await getVisitorLocation();

  /* Тариф необовʼязковий: секція з цінами прихована, тож більшість заявок
     приходить без нього. Якщо він усе ж переданий (стара кнопка чи
     збережене посилання) — перевіряємо і рахуємо суму на сервері. */
  const tierInput = typeof body.tier === "string" ? body.tier : null;
  const minutesInput =
    typeof body.minutes === "number"
      ? body.minutes
      : typeof body.minutes === "string" && body.minutes.trim() !== ""
        ? Number(body.minutes)
        : null;

  const tier =
    isTierSlug(tierInput) && isMinutes(minutesInput)
      ? (TIERS.find((t) => t.slug === tierInput) ?? null)
      : null;

  // Суму рахуємо на сервері з pricing.ts — клієнтським значенням не довіряємо.
  const amount =
    tier && isMinutes(minutesInput) ? priceFor(tier, minutesInput, currency) : null;

  const orderId = crypto.randomUUID();

  const payload = {
    event: "lume.order.created" as const,
    orderId,
    name,
    telegram,
    // Сайт лише українською — лишаємо поле для сумісності з n8n workflow,
    // яка вже очікує locale у payload.
    locale: "uk" as const,
    tier: tier?.slug ?? null,
    tierLabel: tier?.name ?? null,
    minutes: tier ? minutesInput : null,
    price: amount,
    amount,
    currency,
    createdAt: new Date().toISOString(),
  };

  const delivery = await deliverToN8n(payload);
  if (!delivery.ok) {
    console.error("[orders] n8n delivery failed:", delivery.reason);
    return Response.json(
      { error: "Не вдалося надіслати заявку. Спробуйте ще раз за хвилину." },
      { status: 502 },
    );
  }

  return Response.json(
    {
      ok: true,
      orderId,
      locale: payload.locale,
      tier: payload.tier,
      tierLabel: payload.tierLabel,
      minutes: payload.minutes,
      price: payload.price,
      amount: payload.amount,
      currency: payload.currency,
    },
    { status: 201 },
  );
}
