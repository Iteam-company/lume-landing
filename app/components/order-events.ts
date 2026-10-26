/* ============================================================
   Відкриття анкети замовлення.

   Анкета (OrderQuiz) змонтована один раз на сторінці, а кнопки, що її
   відкривають, розкидані по секціях — у hero, у процесі, у картках
   тарифів, у блоці звʼязку. Звʼязуємо їх подією на window: так
   серверним секціям не треба загортатися в спільний клієнтський
   контекст, а кнопка лишається крихітним клієнтським острівцем.
   ============================================================ */

import type { TierSlug } from "../pricing";

/** Що вже відомо на момент відкриття: картка тарифу передає свій вибір. */
export type OrderPrefill = {
  tier?: TierSlug;
  minutes?: number;
  song?: boolean;
};

export const ORDER_EVENT = "lume:order-open";

export function openOrder(prefill: OrderPrefill = {}): void {
  window.dispatchEvent(new CustomEvent<OrderPrefill>(ORDER_EVENT, { detail: prefill }));
}
