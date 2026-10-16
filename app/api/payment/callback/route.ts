import { wfpSignature } from "../../../../lib/wayforpay-sign";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ============================================================
   Відповідь WayForPay про долю платежу.

   Приходить з їхніх серверів, а не з браузера, тож це єдине місце,
   якому можна вірити про факт оплати. Перевіряємо підпис: без цього
   «оплачено» міг би надіслати будь-хто, хто знає адресу.

   У відповідь WayForPay чекає на підтверджений JSON — інакше
   повторюватиме запит.
   ============================================================ */

export async function POST(request: Request) {
  const raw = await request.text();

  /* Тіло приходить або як JSON, або як form-urlencoded з єдиним
     полем-ключем — приймаємо обидва варіанти. */
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    try {
      const firstKey = new URLSearchParams(raw).keys().next().value ?? "";
      data = JSON.parse(decodeURIComponent(firstKey)) as Record<string, unknown>;
    } catch {
      console.error("[payment] callback: unparsable body", raw.slice(0, 300));
      return Response.json({ error: "bad-request" }, { status: 400 });
    }
  }

  const value = (key: string) => (data[key] == null ? "" : String(data[key]));

  const expected = wfpSignature([
    value("merchantAccount"),
    value("orderReference"),
    value("amount"),
    value("currency"),
    value("authCode"),
    value("cardPan"),
    value("transactionStatus"),
    value("reasonCode"),
  ]);

  if (expected !== value("merchantSignature")) {
    console.error("[payment] callback: bad signature", value("orderReference"));
    return Response.json({ error: "bad-signature" }, { status: 403 });
  }

  console.info(
    `[payment] ${value("orderReference")} → ${value("transactionStatus")} · ${value("amount")} ${value("currency")} · ${value("reason")}`,
  );

  // TODO: коли буде бот або таблиця — повідомляти менеджера саме звідси.

  const time = Math.floor(Date.now() / 1000);
  const orderReference = value("orderReference");

  return Response.json({
    orderReference,
    status: "accept",
    time,
    signature: wfpSignature([orderReference, "accept", time]),
  });
}
