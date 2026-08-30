/* ============================================================
   Meta (Facebook) Pixel.

   ID зашитий у код навмисно, без змінної оточення.
   Якщо значення зробити порожнім, піксель не підключається взагалі:
   жодних запитів до Meta і жодних cookie.
   ============================================================ */

export const META_PIXEL_ID = "1063832216432639";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Безпечно надсилає подію: мовчить, якщо піксель вимкнений або ще не завантажився. */
export function trackPixel(event: string, params?: Record<string, unknown>) {
  if (!META_PIXEL_ID) return;
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}
