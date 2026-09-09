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

/** Профіль в Instagram — плаваюча кнопка та посилання в hero/футері. */
export const INSTAGRAM_LINK =
  process.env.NEXT_PUBLIC_INSTAGRAM_LINK ??
  "https://www.instagram.com/lumestory.ua/";

/** WhatsApp — той самий номер, що й Telegram. Зашитий у код. */
export const WHATSAPP_LINK = "https://wa.me/380638977496";

/** Telegram — чат із менеджером за номером +380 63 897 74 96.
 *  Одне посилання і для плаваючої кнопки, і для кнопки у формі.
 *  Номер зашитий у код навмисно, без змінної оточення: щоб змінити —
 *  правимо цей рядок. */
export const TELEGRAM_LINK = "https://t.me/+380638977496";
