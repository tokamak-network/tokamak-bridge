import { useRecoilValue } from "recoil";
import { useV3MintInfo } from "./useV3MintInfo";
import { useMemo } from "react";
import { lastFocusedInput } from "@/recoil/pool/setPoolPosition";
import { useInOutTokens } from "../token/useInOutTokens";
import { ethers } from "ethers";
import commafy from "@/utils/trim/commafy";
import { smallNumberFormmater } from "@/utils/number/compareNumbers";

export function useIncreaseAmount() {
  const { invertPrice, dependentAmount, deposit0Disabled, deposit1Disabled } =
    useV3MintInfo();
  const { inToken, outToken } = useInOutTokens();
  const lastFocused = useRecoilValue(lastFocusedInput);

  const token0Input = useMemo(() => {
    return lastFocused === "LeftInput"
      ? invertPrice
        ? dependentAmount?.quotient
        : inToken?.amountBN
      : invertPrice
      ? deposit1Disabled
        ? 0
        : outToken?.amountBN
      : deposit0Disabled
      ? 0
      : dependentAmount?.quotient;
  }, [
    invertPrice,
    dependentAmount,
    deposit0Disabled,
    deposit1Disabled,
    inToken,
    outToken,
  ]);

  const token1Input = useMemo(() => {
    return lastFocused === "RightInput"
      ? invertPrice
        ? dependentAmount?.quotient
        : outToken?.amountBN
      : invertPrice
      ? deposit0Disabled
        ? 0
        : inToken?.amountBN
      : deposit1Disabled
      ? 0
      : dependentAmount?.quotient;
  }, [
    invertPrice,
    dependentAmount,
    deposit0Disabled,
    deposit1Disabled,
    inToken,
    outToken,
  ]);

  const token0ParsedAmount = useMemo(() => {
    if (token0Input !== undefined && token0Input !== null) {
      const result = ethers.utils
        .formatUnits(
          token0Input?.toString(),
          invertPrice ? outToken?.decimals : inToken?.decimals
        )
        .toString();
      return smallNumberFormmater(result, 6, false, true);
    }
  }, [token0Input, inToken, outToken, invertPrice]);

  const token1ParsedAmount = useMemo(() => {
    if (token1Input !== undefined && token1Input !== null) {
      const result = ethers.utils
        .formatUnits(
          token1Input?.toString(),
          invertPrice ? inToken?.decimals : outToken?.decimals
        )
        .toString();
      return smallNumberFormmater(result, 6, false, true);
    }
  }, [token1Input, inToken, outToken, invertPrice]);

  return { token0Input, token1Input, token0ParsedAmount, token1ParsedAmount };
}
