import { isMinutes, isTierSlug } from "../../paddle";
import { finalPrice, TIERS } from "../../pricing";
import { deliverToN8n } from "../../../lib/n8n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CURRENCY = "USD" as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

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
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const telegram = typeof body.telegram === "string" ? body.telegram.trim() : "";

  if (!name) return badRequest("Вкажіть імʼя");
  if (!phone) return badRequest("Вкажіть номер телефону");
  if (!email || !EMAIL_RE.test(email)) return badRequest("Вкажіть коректний e-mail");

  const tierInput = typeof body.tier === "string" ? body.tier : null;
  if (!isTierSlug(tierInput)) return badRequest("Невідомий тариф");

  const minutesInput =
    typeof body.minutes === "number"
      ? body.minutes
      : typeof body.minutes === "string" && body.minutes.trim() !== ""
        ? Number(body.minutes)
        : null;
  if (!isMinutes(minutesInput)) {
    return badRequest("Хронометраж має бути від 1 до 5 хвилин");
  }

  const tier = TIERS.find((t) => t.slug === tierInput);
  const option = tier?.options.find((o) => o.minutes === minutesInput);
  if (!tier || !option) return badRequest("Такий тариф зараз недоступний");

  const orderId = crypto.randomUUID();

  const payload = {
    event: "lume.order.created" as const,
    orderId,
    name,
    phone,
    telegram: telegram || null,
    email,
    tier: tier.slug,
    tierLabel: tier.name,
    minutes: option.minutes,
    price: finalPrice(option),
    currency: CURRENCY,
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
      tier: payload.tier,
      tierLabel: payload.tierLabel,
      minutes: payload.minutes,
      price: payload.price,
      currency: payload.currency,
    },
    { status: 201 },
  );
}
