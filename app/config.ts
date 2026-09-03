/* ============================================================
   Налаштування лендингу — приходять зі змінних оточення.
   Значення задаються у .env.local (локально) або в налаштуваннях
   хостингу (Vercel → Settings → Environment Variables).
   Перелік і опис змінних — у .env.example.

   Префікс NEXT_PUBLIC_ обовʼязковий: форма працює у браузері,
   а без префікса змінна лишається тільки на сервері.
   ============================================================ */

/** Контактний e-mail для структурованої розмітки (JSON-LD). */
export const ORDER_EMAIL = process.env.NEXT_PUBLIC_ORDER_EMAIL ?? "";

/** Посилання для плаваючої кнопки WhatsApp, напр. https://wa.me/380671234567 */
export const WHATSAPP_LINK =
  process.env.NEXT_PUBLIC_WHATSAPP_LINK ?? "https://wa.me/";

/** Профіль в Instagram — плаваюча кнопка та посилання в hero/футері. */
export const INSTAGRAM_LINK =
  process.env.NEXT_PUBLIC_INSTAGRAM_LINK ??
  "https://www.instagram.com/lumestory.ua/";

/** Telegram — плаваюча кнопка. Приклад: https://t.me/lumestory */
export const TELEGRAM_LINK =
  process.env.NEXT_PUBLIC_TELEGRAM_LINK ?? "https://t.me/lumestory";
