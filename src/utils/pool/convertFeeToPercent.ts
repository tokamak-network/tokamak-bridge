import { FeeAmount } from "@uniswap/v3-sdk";

export function convertFeeToPercent(fee: FeeAmount) {
  return fee === FeeAmount.LOWEST
    ? "0.01%"
    : fee === FeeAmount.LOW
    ? "0.05%"
    : fee === FeeAmount.MEDIUM
    ? "0.3%"
    : "1%";
}
