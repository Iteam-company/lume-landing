/* ============================================================
   Тарифи. Ціни в доларах США.

   Кожен тариф має варіанти хронометражу. Для кожного:
     `minutes` — тривалість мультфільму,
     `base`    — звичайна ціна,
     `sale`    — стартова ціна (діє до LAUNCH_UNTIL).

   Відсоток знижки і ціна за хвилину рахуються автоматично.
   ============================================================ */

/** Доки діє стартова ціна. Формат YYYY-MM-DD.
 *  ПІДТВЕРДІТЬ ДАТУ: після неї сайт має показувати звичайну ціну,
 *  а замовлення — прийматися вже за нею. */
export const LAUNCH_UNTIL = "2026-09-30";

export type PlanOption = {
  minutes: number;
  base: number;
  sale?: number;
};

export type Tier = {
  name: string;
  tagline: string;
  options: PlanOption[];
  /** Який варіант показати одразу (індекс у options) */
  defaultOption?: number;
  /** Що входить саме в цей тариф */
  features: string[];
  featured?: boolean;
  badge?: string;
};

/* Ціна в кожному тарифі лінійна: постановча частина + ставка за хвилину.
   Тому 1, 2 і 5 хвилин — це точне продовження ряду 3 і 4 хвилини, а не
   окремо придумані цифри. `defaultOption` вирішує, який варіант видно
   одразу: скрізь 1 хвилина, щоб перше число не відлякувало. */
export const TIERS: Tier[] = [
  {
    name: "STORY",
    tagline: "Доступний спосіб перетворити свою історію на фільм",
    // Стартова ціна: 59 + 80 за кожну хвилину. Звичайна — та сама формула
    // зі збереженням знижки ~14%. Дані для 3 хвилин — ваші, решта продовжує ряд.
    options: [
      { minutes: 1, base: 159, sale: 139 },
      { minutes: 2, base: 259, sale: 219 },
      { minutes: 3, base: 349, sale: 299 },
      { minutes: 4, base: 439, sale: 379 },
      { minutes: 5, base: 539, sale: 459 },
    ],
    defaultOption: 0,
    features: [
      "Один основний візуальний стиль",
      "Стандартна деталізація персонажів",
      "Простіша режисура та анімація",
      "Готова музика і стандартний саунд-дизайн",
      "Обмежена кількість правок",
    ],
  },
  {
    name: "SIGNATURE",
    tagline: "Персональний міні-фільм, а не просто відео",
    // Стартова ціна: 89 + 120 за кожну хвилину, знижка ~15%.
    options: [
      { minutes: 1, base: 249, sale: 209 },
      { minutes: 2, base: 389, sale: 329 },
      { minutes: 3, base: 529, sale: 449 },
      { minutes: 4, base: 669, sale: 569 },
      { minutes: 5, base: 809, sale: 689 },
    ],
    defaultOption: 0,
    features: [
      "Глибше опрацювання історії",
      "Сценарист і розкадровка",
      "Краща постійність облич",
      "Більше унікальних локацій і складніші сцени",
      "Озвучення та кінематографічна музика",
      "2 кола правок",
      "Серйозніший монтаж",
    ],
    badge: "Найкращий вибір",
    featured: true,
  },
  {
    name: "CINEMA",
    tagline: "Максимум режисури, деталей і звуку",
    // Стартова ціна: 149 + 200 за кожну хвилину, знижка ~17%.
    options: [
      { minutes: 1, base: 419, sale: 349 },
      { minutes: 2, base: 659, sale: 549 },
      { minutes: 3, base: 899, sale: 749 },
      { minutes: 4, base: 1139, sale: 949 },
      { minutes: 5, base: 1379, sale: 1149 },
    ],
    defaultOption: 0,
    features: [
      "Індивідуальний арт-дирекшн",
      "Максимальна схожість персонажів",
      "Складна режисура та динамічні сцени",
      "Максимальна деталізація",
      "Кастомне озвучення і серйозний sound design",
      "Кілька варіантів ключових сцен",
      "3 кола правок",
      "Пріоритетне виробництво",
    ],
  },
];

/** Ціна, яку платить клієнт зараз. */
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

/** Найвигідніша ціна за хвилину в межах тарифу. */
export function bestPerMinute(tier: Tier): number {
  return Math.min(...tier.options.map(perMinute));
}

/** $1 050 — з нерозривним пробілом між тисячами. */
export function price(value: number): string {
  return "$" + value.toLocaleString("uk-UA").replace(/\s/g, " ");
}

/** «3 хвилини» — називний відмінок. */
export function minutesLabel(minutes: number): string {
  const word = minutes === 1 ? "хвилина" : minutes < 5 ? "хвилини" : "хвилин";
  return `${minutes} ${word}`;
}

/** «за 3 хвилини» — знахідний відмінок. */
export function minutesLabelAcc(minutes: number): string {
  const word = minutes === 1 ? "хвилину" : minutes < 5 ? "хвилини" : "хвилин";
  return `${minutes} ${word}`;
}

const MONTHS = [
  "січня", "лютого", "березня", "квітня", "травня", "червня",
  "липня", "серпня", "вересня", "жовтня", "листопада", "грудня",
];

/** «30 вересня 2026» — без залежності від локалі середовища. */
export function launchUntilLabel(): string {
  const [y, m, d] = LAUNCH_UNTIL.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** Усі варіанти всіх тарифів — для структурованої розмітки. */
export const ALL_OPTIONS = TIERS.flatMap((tier) =>
  tier.options.map((option) => ({ tier, option }))
);
