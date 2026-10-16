/* ============================================================
   WayForPay — спільні константи для сервера й клієнта.

   Секретний ключ сюди НЕ потрапляє: підпис рахує лише сервер
   (app/api/payment). У браузер їде готовий набір параметрів із
   підписом — підробити суму в ньому вже не вийде, бо підпис її
   накриває.
   ============================================================ */

export const WFP_MERCHANT_ACCOUNT = "www_lume_kyiv_ua";

/** Домен має збігатися з тим, що зареєстрований у кабінеті WayForPay,
 *  інакше платіж відхиляється з «невалідним підписом». */
export const WFP_MERCHANT_DOMAIN = "www.lume.kyiv.ua";

/** Скрипт віджета. Вантажимо лише коли людина тисне «Оплатити». */
export const WFP_WIDGET_SRC = "https://secure.wayforpay.com/server/pay-widget.js";

/** WayForPay працює з гривнею — для євро-ринку кнопки оплати немає. */
export const WFP_CURRENCY = "UAH";

export type PaymentParams = {
  merchantAccount: string;
  merchantDomainName: string;
  merchantAuthType: string;
  merchantSignature: string;
  orderReference: string;
  orderDate: number;
  amount: number;
  currency: string;
  productName: string[];
  productPrice: number[];
  productCount: number[];
  language: string;
  serviceUrl?: string;
  returnUrl?: string;
  clientFirstName?: string;
  clientPhone?: string;
};
