import { FeeAmount } from "@uniswap/v3-sdk";
import { atom } from "recoil";

export const poolFeeStatus = atom<FeeAmount | undefined>({
  key: "poolFee",
  default: undefined,
});


export const removeAmount = atom<number> ({
  key: 'feeAmount',
  default: 0
})