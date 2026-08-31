
import type { TierSlug } from "./pricing";

/** Set to true to re-enable Paddle checkout. */
export const PADDLE_ENABLED = false as const;

export const PADDLE_ENV = "sandbox" as const;

export const PADDLE_CLIENT_TOKEN =
  process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "";

export type Minutes = 1 | 2 | 3 | 4 | 5;

export type CheckoutCustomData = {
  tier: TierSlug;
  minutes: Minutes;
};

/**
 * tier + minutes -> Paddle Sandbox price_id (one-time, USD, qty 1/1).
 *
 * Єдине джерело price_id. Суми тут НЕ дублюємо — вони живуть у
 * app/pricing.ts (`finalPrice(option)`). Ці sandbox-ціни синхронізовані
 * саме з тими сумами; попередній набір заархівовано в Paddle.
 */
/* Partial: у DIAMOND ще немає позицій у Paddle, тому для нього
   resolvePaddlePriceId поверне null і каса просто не відкриється. */
const SANDBOX_PRICE_IDS: Partial<Record<TierSlug, Record<Minutes, string>>> = {
  story: {
    1: "pri_01m11nrkhc8vnzfjrafrtf057g",
    2: "pri_01m11nrkp0nvet0dxwab6njnvx",
    3: "pri_01m11nrkvdtf90znfxnytw7p19",
    4: "pri_01m11nrkzsn4nbbt9cmza1pvvv",
    5: "pri_01m11nrm46hcspwxdwhdnxfba8",
  },
  signature: {
    1: "pri_01m11nrm8a3anqbhtc8fnygyds",
    2: "pri_01m11nrmcjyr8ce7760jaccjch",
    3: "pri_01m11nrmsxqxpcwn15sarbjgxr",
    4: "pri_01m11nrmy2m8s6zdbznyjm6074",
    5: "pri_01m11nrn2w5z35stkb0ech2s4k",
  },
  cinema: {
    1: "pri_01m11nrn9xee5byk261z2nrbkd",
    2: "pri_01m11nrnfq3mz05fgtfxd08p8g",
    3: "pri_01m11nrnmthzq85kyh05r73bwk",
    4: "pri_01m11nrns9tkt3jzqqk2vvna7h",
    5: "pri_01m11nrnxvywaezndx6738qtfm",
  },
};

const TIER_SLUGS: readonly TierSlug[] = ["story", "signature", "cinema", "diamond"];
const MINUTES_VALUES: readonly Minutes[] = [1, 2, 3, 4, 5];

export function isTierSlug(value: string | null | undefined): value is TierSlug {
  return value != null && TIER_SLUGS.includes(value as TierSlug);
}

export function isMinutes(value: number | null | undefined): value is Minutes {
  return value != null && MINUTES_VALUES.includes(value as Minutes);
}

export function resolvePaddlePriceId(
  tier: string | null | undefined,
  minutes: number | null | undefined,
): string | null {
  if (!isTierSlug(tier) || !isMinutes(minutes)) return null;
  return SANDBOX_PRICE_IDS[tier]?.[minutes] ?? null;
}
