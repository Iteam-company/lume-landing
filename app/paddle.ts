
import type { TierSlug } from "./pricing";

export const PADDLE_ENV = "sandbox" as const;

export const PADDLE_CLIENT_TOKEN =
  process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "";

export type Minutes = 1 | 2 | 3 | 4 | 5;

export type CheckoutCustomData = {
  tier: TierSlug;
  minutes: Minutes;
};

const SANDBOX_PRICE_IDS: Record<TierSlug, Record<Minutes, string>> = {
  story: {
    1: "pri_01m1170yag9wkc0rrkd3dc69jh",
    2: "pri_01m1170yea3y1dj8v3dyjfe6a6",
    3: "pri_01m1170yh1k64ggjzzdgqg5pgz",
    4: "pri_01m1170yncvvjtbxj6v0an1jyx",
    5: "pri_01m1170yr3gttbpfjnbxee7p54",
  },
  signature: {
    1: "pri_01m1170yx192nm9j11ka33b7jr",
    2: "pri_01m1170yz62eaw89fz4v650c3x",
    3: "pri_01m1170z1hkx7ectx26nz1ev88",
    4: "pri_01m1170z3m74ksxg9g3vae6ed8",
    5: "pri_01m1170z7j0fp5hc3ze2s4yt8m",
  },
  cinema: {
    1: "pri_01m1170zcxn2zkcgyfzc62b06q",
    2: "pri_01m1170zf7tkn5vx9ppbxtdf1a",
    3: "pri_01m1170zhq2vt3jgzbfs1n4g1c",
    4: "pri_01m1170zke3njgq04fzjx7aq5n",
    5: "pri_01m1170znb8vfh05t4341c70ka",
  },
};

const TIER_SLUGS: readonly TierSlug[] = ["story", "signature", "cinema"];
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
  return SANDBOX_PRICE_IDS[tier][minutes] ?? null;
}
