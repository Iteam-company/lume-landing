/* ============================================================
   Meta (Facebook) Pixel.

   ID зашитий у код навмисно, без змінної оточення.
   ВСТАВТЕ СЮДИ ID ПІКСЕЛЯ — рядок цифр із Events Manager.
   Поки значення порожнє, піксель не підключається взагалі:
   жодних запитів до Meta і жодних cookie.
   ============================================================ */

export const META_PIXEL_ID = "";

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
