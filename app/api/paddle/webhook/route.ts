/* ============================================================
   Paddle webhook — server-side fulfillment для one-time оплати.

   Тільки Paddle Sandbox. Lume не використовує підписки, тому тут
   обробляється лише `transaction.completed`; решта подій — no-op.

   На цьому етапі БД немає: після перевіреної події пишемо
   структурований лог. Пізніше тут буде запис оплаченого замовлення.
   ============================================================ */

import {
  EventName,
  NodeRuntime,
  Webhooks,
  type TransactionCompletedEvent,
} from "@paddle/paddle-node-sdk";
import type { CheckoutCustomData } from "../../../paddle";

// Перевірка HMAC-підпису потребує Node.js runtime (не Edge).
export const runtime = "nodejs";
// Вебхук не можна кешувати — виконуємо на кожен запит.
export const dynamic = "force-dynamic";

// Реєструє Node crypto-провайдер у RuntimeProvider SDK. Без цього
// standalone `new Webhooks().unmarshal()` завжди повертає "signature
// verification failed" — провайдер інакше ставиться лише конструктором
// `new Paddle(...)`, якого ми тут не використовуємо.
NodeRuntime.initialize();

const webhooks = new Webhooks();

export async function POST(request: Request) {
  const signature = request.headers.get("paddle-signature") ?? "";
  const rawBody = await request.text();
  const secret = process.env.PADDLE_WEBHOOK_SECRET ?? "";

  // Дешеві перевірки: без підпису / тіла / секрету верифікувати нічого.
  // JSON.parse тіла НЕ робимо до перевірки підпису.
  if (!signature || !rawBody || !secret) {
    return Response.json(
      { error: "Missing signature, body, or webhook secret" },
      { status: 400 },
    );
  }

  try {
    // Звіряє підпис із заголовка `paddle-signature` проти СИРОГО тіла,
    // використовуючи signing secret (НЕ API key). Кидає помилку на
    // невірному підписі, простроченому timestamp або зіпсованому payload.
    const event = await webhooks.unmarshal(rawBody, secret, signature);

    if (event?.eventType === EventName.TransactionCompleted) {
      logTransactionCompleted(event);
    }
    // Будь-яка інша подія: підтверджуємо і поки ігноруємо.

    return Response.json({ received: true });
  } catch (error) {
    // Будь-який не-2xx → Paddle повторить доставку (at-least-once).
    // Це покриває і підроблений запит, і ротований-але-не-задеплоєний
    // секрет — обидва випадки безпечно відновлюються на ретраї.
    console.error("[paddle] webhook rejected:", error);
    return Response.json({ error: "Webhook not processed" }, { status: 500 });
  }
}

/** Структурований лог підтвердженої one-time оплати. Без чутливих даних. */
function logTransactionCompleted(event: TransactionCompletedEvent) {
  const txn = event.data;
  const custom = (txn.customData ?? {}) as Partial<CheckoutCustomData> &
    Record<string, unknown>;
  const totals = txn.details?.totals ?? null;
  const firstPrice = txn.items?.[0]?.price ?? null;

  console.info("[paddle] transaction.completed", {
    eventId: event.eventId,
    notificationId: event.notificationId,
    occurredAt: event.occurredAt,
    transactionId: txn.id,
    status: txn.status,
    customerId: txn.customerId,
    currency: totals?.currencyCode ?? txn.currencyCode,
    // Сума в найменшій одиниці валюти, напр. "8500" = $85.00.
    amount: totals?.grandTotal ?? null,
    priceId: firstPrice?.id ?? null,
    productId: firstPrice?.productId ?? null,
    tier: custom.tier ?? null,
    minutes: custom.minutes ?? null,
    // email: у payload `transaction.completed` немає — знадобиться підписка
    // на customer.* або серверний lookup клієнта (див. звіт).
  });
}
