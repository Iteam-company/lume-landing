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

/* Ціна рахується від ставки за хвилину: вартість = ставка × хвилини.
   Щоб змінити тариф, достатньо однієї цифри в ladder() — усі пʼять
   варіантів, ціна за хвилину, знижка, FAQ і розмітка для пошуку
   перерахуються самі. `defaultOption: 0` показує 1 хвилину першою. */

export type PlanOption = {
  minutes: number;
  base: number;
  sale?: number;
};

export type TierSlug = "story" | "signature" | "cinema";

/** Будує варіанти 1..maxMinutes із ставки за хвилину.
 *  `rate` — стартова ставка, `regularRate` — звичайна (до кінця акції). */
function ladder(rate: number, regularRate: number, maxMinutes = 5): PlanOption[] {
  return Array.from({ length: maxMinutes }, (_, i) => {
    const minutes = i + 1;
    return { minutes, base: regularRate * minutes, sale: rate * minutes };
  });
}

export type Tier = {
  name: string;
  slug: TierSlug;
  tagline: string;
  options: PlanOption[];
  /** Який варіант показати одразу (індекс у options) */
  defaultOption?: number;
  /** Що входить саме в цей тариф */
  features: string[];
  featured?: boolean;
  badge?: string;
};

export const TIERS: Tier[] = [
  {
    name: "STORY",
    slug: "story",
    tagline: "Доступний спосіб перетворити свою історію на фільм",
    // 85 за хвилину; звичайна ставка 99 зберігає знижку ~14%
    options: ladder(85, 99),
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
    slug: "signature",
    tagline: "Персональний міні-фільм, а не просто відео",
    // 130 за хвилину; звичайна ставка 153 зберігає знижку ~15%
    options: ladder(130, 153),
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
    slug: "cinema",
    tagline: "Максимум режисури, деталей і звуку",
    // 170 за хвилину; звичайна ставка 204 зберігає знижку ~17%
    options: ladder(170, 204),
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
