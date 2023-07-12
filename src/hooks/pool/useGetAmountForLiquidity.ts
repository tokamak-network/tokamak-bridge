import { SqrtPriceMath, TickMath } from "@uniswap/v3-sdk";
import { BigNumber, ethers } from "ethers";
import { useInOutTokens } from "../token/useInOutTokens";
import { useGetPool, useV3MintInfo } from "./useV3MintInfo";
import { useMemo } from "react";
import JSBI from "jsbi";

function getLiquidityForAmount1(
  sqrtRatioAX96: JSBI,
  sqrtRatioBX96: JSBI,
  amount1: BigInt
) {
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    let temp;
    temp = sqrtRatioAX96;
    sqrtRatioAX96 = sqrtRatioBX96;
    sqrtRatioBX96 = temp;
  }
  let FixedPoint96Q96 = ethers.BigNumber.from("0x1000000000000000000000000");

  const param1 = JSBI.multiply(
    JSBI.BigInt(amount1.toString()),
    JSBI.BigInt(FixedPoint96Q96.toString())
  );
  const param2 = JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96);

  return JSBI.divide(param1, param2);
}
function getLiquidityForAmount0(
  sqrtRatioAX96: JSBI,
  sqrtRatioBX96: JSBI,
  amount0: any
) {
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    let temp;
    temp = sqrtRatioAX96;
    sqrtRatioAX96 = sqrtRatioBX96;
    sqrtRatioBX96 = temp;
  }
  let FixedPoint96Q96 = ethers.BigNumber.from("0x1000000000000000000000000");

  const param1 = JSBI.multiply(sqrtRatioAX96, sqrtRatioBX96);
  const intermediate = JSBI.divide(
    param1,
    JSBI.BigInt(FixedPoint96Q96.toString())
  );
  const param2 = JSBI.multiply(JSBI.BigInt(amount0.toString()), intermediate);
  const param3 = JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96);
  return JSBI.divide(param2, param3);
}

export function useGetAmountForLiquidity(params: { inTokenInput: boolean }) {
  const { inTokenInput } = params;
  const { pool } = useGetPool();
  const { inToken, outToken } = useInOutTokens();

  const amount0Desired = inToken?.amountBN;
  const amount1Desired = outToken?.amountBN;

  const { ticks } = useV3MintInfo();

  const lowerTick = ticks.LOWER;
  const upperTick = ticks.UPPER;
  const currentTick = pool?.tickCurrent;

  console.log("pool");
  console.log(pool);

  const amountForToken0 = useMemo(() => {
    if (lowerTick && upperTick && currentTick && amount1Desired) {
      const lowerPriceX96 = TickMath.getSqrtRatioAtTick(lowerTick);
      const currentsqrtPriceX96 = TickMath.getSqrtRatioAtTick(currentTick);
      const uppersqrtPriceX96 = TickMath.getSqrtRatioAtTick(upperTick);

      const liquidity = getLiquidityForAmount1(
        lowerPriceX96,
        currentsqrtPriceX96,
        amount1Desired
      );

      const result = SqrtPriceMath.getAmount0Delta(
        currentsqrtPriceX96,
        uppersqrtPriceX96,
        liquidity,
        false
      );

      return result;
    }
  }, [amount0Desired, amount1Desired, lowerTick, upperTick, currentTick]);

  const amountForToken1 = useMemo(() => {
    if (lowerTick && upperTick && currentTick && amount1Desired) {
      const lowerPriceX96 = TickMath.getSqrtRatioAtTick(lowerTick);
      const currentsqrtPriceX96 = TickMath.getSqrtRatioAtTick(currentTick);
      const uppersqrtPriceX96 = TickMath.getSqrtRatioAtTick(upperTick);

      const liquidity = getLiquidityForAmount0(
        currentsqrtPriceX96,
        uppersqrtPriceX96,
        amount0Desired
      );

      const result = SqrtPriceMath.getAmount1Delta(
        lowerPriceX96,
        currentsqrtPriceX96,
        liquidity,
        false
      );

      return result;
    }
  }, [amount0Desired, amount1Desired, lowerTick, upperTick, currentTick]);

  return { amountForToken0, amountForToken1 };
}
