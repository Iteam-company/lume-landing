import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { isMinutes, isTierSlug } from "../../paddle";
import { finalPrice, optionsFor, songPrice, TIERS } from "../../pricing";
import { getVisitorLocation } from "../../location";
import { SITE_URL } from "../../site";
import {
  WFP_CURRENCY,
  WFP_MERCHANT_ACCOUNT,
  WFP_MERCHANT_DOMAIN,
  type PaymentParams,
} from "../../wayforpay";
import { wfpConfigured, wfpSignature } from "../../../lib/wayforpay-sign";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Чи доступна оплата карткою цьому відвідувачу. */
export async function GET() {
  const { currency } = await getVisitorLocation();
  return Response.json({
    enabled: wfpConfigured() && currency === WFP_CURRENCY,
    currency,
  });
}

export async function POST(request: Request) {
  if (!wfpConfigured()) {
    return Response.json({ error: "not-configured" }, { status: 503 });
  }

  /* Валюту бере сервер із гео, а не з тіла запиту: WayForPay приймає
     лише гривню, і платити за євро-цінами тут не можна. */
  const { currency } = await getVisitorLocation();
  if (currency !== WFP_CURRENCY) {
    return Response.json({ error: "wrong-currency" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  const tierSlug = typeof body.tier === "string" ? body.tier : null;
  const minutes = typeof body.minutes === "number" ? body.minutes : Number(body.minutes);
  if (!isTierSlug(tierSlug) || !isMinutes(minutes)) {
    return Response.json({ error: "bad-order" }, { status: 400 });
  }

  const tier = TIERS.find((t) => t.slug === tierSlug);
  const option = tier && optionsFor(tier, currency).find((o) => o.minutes === minutes);
  if (!tier || !option) return Response.json({ error: "bad-order" }, { status: 400 });

  /* СУМУ РАХУЄ СЕРВЕР із pricing.ts — єдиного джерела цін на сайті.
     Клієнт присилає лише тариф, хронометраж і галочку пісні; будь-яке
     число з браузера тут ігнорується. */
  const withSong = body.song === true && !tier.songIncluded;
  const amount = finalPrice(option) + (withSong ? songPrice(currency) : 0);

  const orderReference = `lume_${Date.now()}_${randomUUID().slice(0, 8)}`;
  const orderDate = Math.floor(Date.now() / 1000);

  const productName = [
    `${tier.name} · ${minutes} min${withSong ? " + song" : ""}`,
  ];
  const productCount = [1];
  const productPrice = [amount];

  const merchantSignature = wfpSignature([
    WFP_MERCHANT_ACCOUNT,
    WFP_MERCHANT_DOMAIN,
    orderReference,
    orderDate,
    amount,
    currency,
    ...productName,
    ...productCount,
    ...productPrice,
  ]);

  const origin = (await headers()).get("origin") ?? SITE_URL;

  const params: PaymentParams = {
    merchantAccount: WFP_MERCHANT_ACCOUNT,
    merchantDomainName: WFP_MERCHANT_DOMAIN,
    merchantAuthType: "SimpleSignature",
    merchantSignature,
    orderReference,
    orderDate,
    amount,
    currency,
    productName,
    productPrice,
    productCount,
    language: "UA",
    // Куди WayForPay надішле результат «за спиною» браузера. Саме він —
    // єдине надійне підтвердження оплати: вікно віджета можна закрити.
    serviceUrl: `${SITE_URL}/api/payment/callback`,
    returnUrl: `${origin}/`,
  };

  console.info(`[payment] created ${orderReference} · ${tier.name} · ${minutes}хв · ${amount} ${currency}`);
  return Response.json(params);
}
