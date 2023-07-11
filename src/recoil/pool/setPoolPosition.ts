import { getTickSpacing } from "@/utils/uniswap/pool/getTickSpacing";
import { Token } from "@uniswap/sdk-core";
import { FeeAmount, tickToPrice } from "@uniswap/v3-sdk";
import { atom, selector } from "recoil";

export const baseToken = atom<Token | undefined>({
  key: "baseToken",
  default: undefined,
});

export const quoteToken = atom<Token | undefined>({
  key: "quoteToken",
  default: undefined,
});

export const poolFeeStatus = atom<FeeAmount | undefined>({
  key: "poolFee",
  default: undefined,
});

export const currentTick = atom<number | undefined>({
  key: "currentTick",
  default: undefined,
});

export const minPrice = atom<string | undefined>({
  key: "minPrice",
  default: undefined,
});

export const minTick = atom<number | undefined>({
  key: "minTick",
  default: undefined,
});

export const maxPrice = atom<string | undefined>({
  key: "maxPrice",
  default: undefined,
});

export const maxTick = atom<number | undefined>({
  key: "maxTick",
  default: undefined,
});

export const currentTickSpacing = selector<number | undefined>({
  key: "currentPriceSelector",
  get: ({ get }) => {
    const feeTier = get(poolFeeStatus);
    const tickSpacing = getTickSpacing(feeTier);
    return tickSpacing;
  },
});

export const currentPrice = selector<string | undefined>({
  key: "currentPriceSelector",
  get: ({ get }) => {
    const currentTickStatus = get(currentTick);
    const quoteTokenStatus = get(quoteToken);
    const baseTokenStatus = get(baseToken);

    if (currentTickStatus && quoteTokenStatus && baseTokenStatus) {
      const currentPrice = tickToPrice(
        quoteTokenStatus,
        quoteTokenStatus,
        currentTickStatus
      );

      return currentPrice.toSignificant(6);
    }

    return undefined;
  },
});
