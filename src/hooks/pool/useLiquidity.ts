import { useRecoilValue } from "recoil";
import { usePositionInfo } from "./useGetPositionIds";
import { removeAmount } from "@/recoil/pool/setPoolPosition";
import { useMemo } from "react";
import { usePricePair } from "../price/usePricePair";
import { ethers } from "ethers";

export function useRemoveLiquidity() {
  const { info } = usePositionInfo();

  const removePercent = useRecoilValue(removeAmount);

  const amount0Removed = useMemo(() => {
    if (info) {
      if (info.rawPositionInfo.token0RemainedAmount && removePercent) {
        const token0AmountBigNumber = ethers.BigNumber.from(
          info.rawPositionInfo.token0RemainedAmount,
        );

        const removePercentBigNumber = ethers.BigNumber.from(
          removePercent * 100,
        );

        const result = token0AmountBigNumber
          .mul(removePercentBigNumber)
          .div(10000);

        return ethers.utils.formatUnits(result, info.token0.decimals);
      }
    }
    return undefined;
  }, [
    info?.rawPositionInfo.token0RemainedAmount,
    info?.token0Amount,
    removePercent,
    info?.token0.decimals,
  ]);

  const amount1Removed = useMemo(() => {
    if (info)
      if (info.rawPositionInfo.token1remainedAmount && removePercent) {
        const token1AmountBigNumber = ethers.BigNumber.from(
          info.rawPositionInfo.token1remainedAmount,
        );
        const removePercentBigNumber = ethers.BigNumber.from(
          removePercent * 100,
        );

        const result = token1AmountBigNumber
          .mul(removePercentBigNumber)
          .div(10000);

        return ethers.utils.formatUnits(result, info.token1.decimals);
      }
    return undefined;
  }, [
    info?.rawPositionInfo.token1RemainedAmount,
    info?.token1Amount,
    removePercent,
    info?.token1.decimals,
  ]);

  const { totalMarketPrice: totalRemovedMarketPrice } = usePricePair({
    token0Name: info ? info.token0.name : undefined,
    token0Amount: amount0Removed?.toString(),
    token1Name: info ? info.token1.name : undefined,
    token1Amount: amount1Removed?.toString(),
  });
  if (!info)
    return {
      amount0Removed: undefined,
      amount1Removed: undefined,
    };
  return { amount0Removed, amount1Removed, totalRemovedMarketPrice };
}
