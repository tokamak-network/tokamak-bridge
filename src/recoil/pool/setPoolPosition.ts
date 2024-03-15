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

export const removeAmount = atom<number>({
  key: "feeAmount",
  default: 0,
});
export const currentTick = atom<number | undefined>({
  key: "currentTick",
  default: undefined,
});

export const minPrice = atom<string | undefined>({
  key: "minPrice",
  default: undefined,
});

export const maxPrice = atom<string | undefined>({
  key: "maxPrice",
  default: undefined,
});

export const atMinTick = atom<boolean>({
  key: "minTick",
  default: false,
});

export const atMaxTick = atom<boolean>({
  key: "maxTick",
  default: false,
});

export const initialPrice = atom<string>({
  key: "intialPrice",
  default: "0",
});

export const minPriceForAddModal = atom<string>({
  key: "minPriceForAddModal",
  default: "-",
});

export const maxPriceForAddModal = atom<string>({
  key: "maxPriceForAddModal",
  default: "-",
});

export const currentTickSpacing = selector<number | undefined>({
  key: "currentPrice",
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

export const lastFocusedInput = atom<"LeftInput" | "RightInput" | undefined>({
  key: "lastFocusedInput",
  default: undefined,
});

export const chartIsOnLoading = atom<boolean>({
  key: "chartIsOnLoading",
  default: true,
});
