/* ============================================================
   Запис заявки в Google-таблицю.

   Пишемо не напряму через Sheets API, а через веб-застосунок Apps
   Script: йому не потрібен сервісний акаунт, ключі й OAuth — лише одна
   адреса у змінній оточення. Код скрипта лежить у docs/google-sheet-lead.gs.
   ============================================================ */

import "server-only";

const ENDPOINT = process.env.GOOGLE_SHEET_WEBHOOK_URL?.trim();
const TIMEOUT_MS = 8000;

export type LeadRow = {
  createdAt: string;
  phone: string;
  lang: string;
  page: string;
  country: string;
  source: string;
  utm: Record<string, string>;
  fbp: string;
  fbc: string;
  referrer: string;
  userAgent: string;
};

export const SHEET_CONFIGURED = Boolean(ENDPOINT);

export async function appendLead(
  row: LeadRow,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (!ENDPOINT) return { ok: false, reason: "GOOGLE_SHEET_WEBHOOK_URL is not set" };

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      // Apps Script відповідає редиректом на googleusercontent — йдемо за ним.
      redirect: "follow",
      cache: "no-store",
    });
    if (!response.ok) return { ok: false, reason: `sheet responded with ${response.status}` };
    return { ok: true };
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return {
      ok: false,
      reason: timedOut ? `sheet did not respond within ${TIMEOUT_MS}ms` : String(error),
    };
  }
}
