/* ============================================================
   Тарифи. Ціни в доларах США.
   `base`  — ціна без знижки, `sale` — зі знижкою.
   Відсоток знижки рахується автоматично, вручну його не вписуйте.
   Щоб прибрати знижку з тарифу — просто видаліть поле `sale`.
   ============================================================ */

export type Plan = {
  /** Назва тарифу */
  name: string;
  /** Хронометраж мультфільму */
  duration: string;
  /** Ціна без знижки, USD */
  base: number;
  /** Ціна зі знижкою, USD */
  sale?: number;
  /** Виділити картку кольором */
  featured?: boolean;
  /** Підпис над назвою (напр. «Найпопулярніший») */
  badge?: string;
};

export const PLANS: Plan[] = [
  {
    name: "PREMIUM",
    duration: "3 хвилини",
    base: 516,
    sale: 420,
  },
  {
    name: "PREMIUM MAX",
    duration: "4 хвилини",
    base: 688,
    sale: 570,
    badge: "Найпопулярніший",
    featured: true,
  },
  {
    name: "ULTIMA",
    duration: "3 хвилини",
    base: 969,
    sale: 860,
  },
  {
    name: "ULTIMA MAX",
    duration: "4 хвилини",
    base: 1292,
    sale: 1050,
  },
];

/** Знижка у відсотках, округлена до цілого. */
export function discount(plan: Plan): number | null {
  if (!plan.sale || plan.sale >= plan.base) return null;
  return Math.round((1 - plan.sale / plan.base) * 100);
}

/** $1 050 — з нерозривним пробілом між тисячами. */
export function price(value: number): string {
  return "$" + value.toLocaleString("uk-UA").replace(/\s/g, " ");
}
