/* ============================================================
   Налаштування лендингу — приходять зі змінних оточення.
   Значення задаються у .env.local (локально) або в налаштуваннях
   хостингу (Vercel → Settings → Environment Variables).
   Перелік і опис змінних — у .env.example.

   Префікс NEXT_PUBLIC_ обовʼязковий: форма працює у браузері,
   а без префікса змінна лишається тільки на сервері.
   ============================================================ */

/** Куди відправляти заявку (Formspree, Getform, власний бекенд). POST з JSON. */
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";

/** Запасний варіант: якщо endpoint не заданий, заявка піде листом на цю адресу. */
export const ORDER_EMAIL = process.env.NEXT_PUBLIC_ORDER_EMAIL ?? "";

/** Посилання для плаваючої кнопки WhatsApp, напр. https://wa.me/380671234567 */
export const WHATSAPP_LINK =
  process.env.NEXT_PUBLIC_WHATSAPP_LINK ?? "https://wa.me/";
