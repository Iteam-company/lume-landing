import "server-only";
import { createHmac } from "node:crypto";

/**
 * Підпис WayForPay: HMAC-MD5 секретним ключем по рядку з параметрів,
 * склеєних через «;» у суворо визначеному порядку. Масиви (назви,
 * кількості, ціни) розгортаються поелементно.
 *
 * Порядок параметрів — не на наш розсуд: будь-яка перестановка дає
 * «невалідний підпис» без пояснень, тому список складається в одному
 * місці й використовується і для запиту, і для перевірки відповіді.
 */
export function wfpSignature(parts: (string | number)[]): string {
  const secret = process.env.WAYFORPAY_SECRET_KEY?.trim();
  if (!secret) throw new Error("WAYFORPAY_SECRET_KEY is not set");

  return createHmac("md5", secret)
    .update(parts.map(String).join(";"), "utf8")
    .digest("hex");
}

export function wfpConfigured(): boolean {
  return Boolean(process.env.WAYFORPAY_SECRET_KEY?.trim());
}
