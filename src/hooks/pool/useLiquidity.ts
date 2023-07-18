import { useRecoilValue } from "recoil";
import { usePositionInfo } from "./useGetPositionIds";
import { removeAmount } from "@/recoil/pool/setPoolPosition";
import { useMemo } from "react";
import { useGetAmountForLiquidity } from "./useGetAmountForLiquidity";
import { useInOutTokens } from "../token/useInOutTokens";
import { usePoolInfo } from "./usePoolInfo";
import { ethers } from "ethers";
import commafy from "@/utils/trim/commafy";

export function useRemoveLiquidity() {
  const { info } = usePositionInfo();

  if (!info)
    return {
      amount0Removed: undefined,
      amount1Removed: undefined,
    };
  const { token0Amount, token1Amount } = info;
  const removePercent = useRecoilValue(removeAmount);

  const amount0Removed = useMemo(() => {
    if (token0Amount && removePercent) {
      return Number(token0Amount) * (removePercent / 100);
    }
  }, [token0Amount, removePercent]);

  const amount1Removed = useMemo(() => {
    if (token1Amount && removePercent) {
      return Number(token1Amount) * (removePercent / 100);
    }
  }, [token1Amount, removePercent]);

  return { amount0Removed, amount1Removed };
}

export function useIncreaseLiquidity() {
  const { amountForToken0, amountForToken1 } = useGetAmountForLiquidity(true);
  const { inToken, outToken } = useInOutTokens();

  const parsedAmountForToken0 = ethers.utils.formatUnits(
    amountForToken0?.toString() ?? "0",
    inToken?.decimals
  );
  const parsedAmountForToken1 = ethers.utils.formatUnits(
    amountForToken1?.toString() ?? "0",
    outToken?.decimals
  );

  return {
    parsedAmountForToken0: commafy(parsedAmountForToken0.toString(), 6),
    parsedAmountForToken1: commafy(parsedAmountForToken1.toString(), 6),
  };
}
