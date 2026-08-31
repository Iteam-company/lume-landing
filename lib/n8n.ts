const WEBHOOK_URL = process.env.N8N_LUME_WEBHOOK_URL ?? "";
const WEBHOOK_SECRET = process.env.N8N_LUME_WEBHOOK_SECRET ?? "";

const TIMEOUT_MS = 4000;

export type N8nDelivery = { ok: true } | { ok: false; reason: string };

export async function deliverToN8n(payload: unknown): Promise<N8nDelivery> {
  if (!WEBHOOK_URL || !WEBHOOK_SECRET) {
    return { ok: false, reason: "n8n webhook is not configured" };
  }

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${WEBHOOK_SECRET}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });

    if (!res.ok) {
      return { ok: false, reason: `n8n responded with ${res.status}` };
    }
    return { ok: true };
  } catch (error) {
    const name =
      typeof error === "object" && error !== null && "name" in error
        ? String((error as { name?: unknown }).name)
        : "";
    const timedOut = name === "TimeoutError" || name === "AbortError";
    return {
      ok: false,
      reason: timedOut
        ? `n8n did not respond within ${TIMEOUT_MS}ms`
        : "n8n request failed",
    };
  }
}
