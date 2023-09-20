import { PoolState } from "@/types/pool/pool";
import { usePool } from "./usePool";
import { useV3MintInfo } from "./useV3MintInfo";
import { useMemo } from "react";
import { useInOutTokens } from "../token/useInOutTokens";
import { PoolCardDetail } from "@/app/pools/components/PoolCard";
import { BigNumber } from "ethers";

export function useMintPositionInfo() {
  const { inToken, outToken } = useInOutTokens();
  const [poolStatus, poolData] = usePool();
  const {
    ticks,
    poolForPosition,
    noLiquidity,
    deposit0Disabled,
    deposit1Disabled,
  } = useV3MintInfo();
  const pool = poolStatus === PoolState.EXISTS ? poolData : poolForPosition;

  const mintPositionInfo: PoolCardDetail | undefined = useMemo(() => {
    if (pool && inToken && outToken && ticks.LOWER && ticks.UPPER) {
      const token0 = pool.token0;
      const token1 = pool.token1;
      const token0Amount = Number(inToken.parsedAmount) ?? 0;
      const token1Amount = Number(outToken.parsedAmount) ?? 0;
      const fee = pool.fee;
      const inRange = deposit0Disabled || deposit1Disabled;
      const liquidity = pool.liquidity.toString();
      const sqrtPriceX96 = pool.sqrtRatioX96.toString();
      const tickLower = ticks.LOWER;
      const tickCurrent = pool.tickCurrent;
      const tickUpper = ticks.UPPER;
      const hasETH = pool.token0.isNative || pool.token1.isNative;

      return {
        id: 0,
        token0,
        token1,
        token0Amount,
        token0CollectedFee: "0",
        token0MarketPrice: "0",
        token0CollectedFeeBN: BigNumber.from("0"),
        token1Amount,
        token1CollectedFee: "0",
        token1MarketPrice: "0",
        token1CollectedFeeBN: BigNumber.from("0"),
        fee,
        inRange: !inRange,
        liquidity,
        sqrtPriceX96,
        tickLower,
        tickCurrent,
        tickUpper,
        rawPositionInfo: pool,
        hasETH,
        isClosed: false,
        token0Value: 0,
        token1Value: 0,
        token0FeeValue: 0,
        token1FeeValue: 0,
        feeValue: 0,
        chainId: pool.token0.chainId,
        owner: "",
        rawData: pool,
      };
    }
    return undefined;
  }, [pool, inToken, outToken, deposit0Disabled, deposit1Disabled, ticks]);

  return { mintPositionInfo };
}
