import { useRecoilValue } from "recoil";
import { usePositionInfo } from "./useGetPositionIds";
import { removeAmount } from "@/recoil/pool/setPoolPosition";
import { useMemo } from "react";
import { usePricePair } from "../price/usePricePair";
import { ethers } from "ethers";

export function useRemoveLiquidity() {
  const { info } = usePositionInfo();
  if (!info)
    return {
      amount0Removed: undefined,
      amount1Removed: undefined,
    };
  const { token0Amount, token1Amount, token0, token1, rawPositionInfo } = info;
  const removePercent = useRecoilValue(removeAmount);

  const amount0Removed = useMemo(() => {
    if (rawPositionInfo.token0RemainedAmount && removePercent) {
      const token0AmountBigNumber = ethers.BigNumber.from(
        rawPositionInfo.token0RemainedAmount
      );

      const removePercentBigNumber = ethers.BigNumber.from(removePercent * 100);

      const result = token0AmountBigNumber
        .mul(removePercentBigNumber)
        .div(10000);

      return ethers.utils.formatUnits(result, token0.decimals);
    }
  }, [
    rawPositionInfo.token0RemainedAmount,
    token0Amount,
    removePercent,
    token0.decimals,
  ]);

  const amount1Removed = useMemo(() => {
    if (rawPositionInfo.token1remainedAmount && removePercent) {
      const token1AmountBigNumber = ethers.BigNumber.from(
        rawPositionInfo.token1remainedAmount
      );
      const removePercentBigNumber = ethers.BigNumber.from(removePercent * 100);

      const result = token1AmountBigNumber
        .mul(removePercentBigNumber)
        .div(10000);

      return ethers.utils.formatUnits(result, token1.decimals);
    }
  }, [
    rawPositionInfo.token1RemainedAmount,
    token1Amount,
    removePercent,
    token1.decimals,
  ]);

  const { totalMarketPrice: totalRemovedMarketPrice } = usePricePair({
    token0Name: token0.name,
    token0Amount: amount0Removed?.toString(),
    token1Name: token1.name,
    token1Amount: amount1Removed?.toString(),
  });

  return { amount0Removed, amount1Removed, totalRemovedMarketPrice };
}
