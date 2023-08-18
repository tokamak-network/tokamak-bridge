import { FeeAmount, TICK_SPACINGS } from "@uniswap/v3-sdk";

export function getTickSpacing(feeAmount: FeeAmount | undefined) {
  if (feeAmount === undefined) return undefined;
  return TICK_SPACINGS[feeAmount];
}
