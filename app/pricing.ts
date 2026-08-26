/* ============================================================
   Тарифи. Ціни в доларах США.

   Кожен тариф має кілька варіантів хронометражу. Для кожного:
     `minutes` — тривалість мультфільму,
     `base`    — ціна без знижки,
     `sale`    — ціна зі знижкою (необовʼязково).

   Відсоток знижки і ціна за хвилину рахуються автоматично —
   вручну їх вписувати не треба.
   ============================================================ */

export type PlanOption = {
  minutes: number;
  base: number;
  sale?: number;
};

export type Tier = {
  /** Назва тарифу */
  name: string;
  /** Короткий опис під назвою */
  tagline: string;
  /** Варіанти хронометражу */
  options: PlanOption[];
  /** Який варіант показати одразу (індекс у options) */
  defaultOption?: number;
  /** Виділити картку кольором */
  featured?: boolean;
  /** Підпис над назвою */
  badge?: string;
};

export const TIERS: Tier[] = [
  {
    name: "STARTER",
    tagline: "Коротка історія про головне",
    options: [
      { minutes: 1, base: 90 },
      { minutes: 2, base: 170 },
      { minutes: 3, base: 220 },
      { minutes: 4, base: 300 },
      { minutes: 5, base: 370 },
    ],
    defaultOption: 2,
  },
  {
    name: "PREMIUM",
    tagline: "Розгорнутий сюжет із деталями",
    options: [
      { minutes: 3, base: 516, sale: 420 },
      { minutes: 4, base: 688, sale: 570 },
    ],
    badge: "Найпопулярніший",
    featured: true,
  },
  {
    name: "ULTIMA",
    tagline: "Максимум опрацювання й нюансів",
    options: [
      { minutes: 3, base: 969, sale: 860 },
      { minutes: 4, base: 1292, sale: 1050 },
    ],
  },
];

/** Ціна, яку платить клієнт: зі знижкою, якщо вона є. */
export function finalPrice(option: PlanOption): number {
  return option.sale ?? option.base;
}

/** Знижка у відсотках, округлена до цілого. Null, якщо знижки немає. */
export function discount(option: PlanOption): number | null {
  if (!option.sale || option.sale >= option.base) return null;
  return Math.round((1 - option.sale / option.base) * 100);
}

/** Скільки коштує одна хвилина за цим варіантом. */
export function perMinute(option: PlanOption): number {
  return Math.round(finalPrice(option) / option.minutes);
}

/** $1 050 — з нерозривним пробілом між тисячами. */
export function price(value: number): string {
  return "$" + value.toLocaleString("uk-UA").replace(/\s/g, " ");
}

/** «3 хвилини» з правильним відмінком. */
export function minutesLabel(minutes: number): string {
  const word = minutes === 1 ? "хвилина" : minutes < 5 ? "хвилини" : "хвилин";
  return `${minutes} ${word}`;
}

/** «за 1 хвилину», «за 3 хвилини», «за 5 хвилин» — знахідний відмінок. */
export function minutesLabelAcc(minutes: number): string {
  const word = minutes === 1 ? "хвилину" : minutes < 5 ? "хвилини" : "хвилин";
  return `${minutes} ${word}`;
}

/** Найвигідніша ціна за хвилину в межах тарифу. */
export function bestPerMinute(tier: Tier): number {
  return Math.min(...tier.options.map(perMinute));
}

/** Усі варіанти всіх тарифів — для структурованої розмітки. */
export const ALL_OPTIONS = TIERS.flatMap((tier) =>
  tier.options.map((option) => ({ tier, option }))
);
