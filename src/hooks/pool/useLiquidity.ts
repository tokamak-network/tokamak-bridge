import { useRecoilValue } from "recoil";
import { usePositionInfo } from "./useGetPositionIds";
import { removeAmount } from "@/recoil/pool/setPoolPosition";
import { useMemo } from "react";
import commafy from "@/utils/trim/commafy";
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
  const comparisonValueBigNumber = ethers.BigNumber.from(
    ethers.utils.parseUnits("0.000001", 18)
  );

  const amount0Removed = useMemo(() => {
    // if (token0Amount && removePercent) {
    //   return Number(token0Amount) * (removePercent / 100);
    // }
    if (rawPositionInfo && removePercent) {
      const token0AmountBigNumber = ethers.BigNumber.from(
        rawPositionInfo.token0RemainedAmount
      );
      const removePercentBigNumber = ethers.BigNumber.from(removePercent * 100);

      const result = token0AmountBigNumber
        .mul(removePercentBigNumber)
        .div(10000);

      return ethers.utils.formatUnits(result, 18);

      // if (result.lt(comparisonValueBigNumber)) {
      //   return "<0.000001";
      // } else {
      //   return ethers.utils.formatUnits(result, 18);
      // }
    }
  }, [
    rawPositionInfo.token0RemainedAmount,
    token0Amount,
    removePercent,
    comparisonValueBigNumber,
  ]);

  const amount1Removed = useMemo(() => {
    if (token1Amount && removePercent) {
      return Number(token1Amount) * (removePercent / 100);
    }
  }, [token1Amount, removePercent]);

  const { totalMarketPrice: totalRemovedMarketPrice } = usePricePair({
    token0Name: token0.name,
    token0Amount: Number(commafy(amount0Removed, 4).replaceAll(",", "")),
    token1Name: token1.name,
    token1Amount: Number(commafy(amount1Removed, 4).replaceAll(",", "")),
  });

  return { amount0Removed, amount1Removed, totalRemovedMarketPrice };
}
