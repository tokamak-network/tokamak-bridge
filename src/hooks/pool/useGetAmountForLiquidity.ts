import { Pool, Position, SqrtPriceMath, TickMath } from "@uniswap/v3-sdk";
import { BigNumber, ethers } from "ethers";
import { useInOutTokens } from "../token/useInOutTokens";
import { useGetPool, useV3MintInfo } from "./useV3MintInfo";
import { useMemo } from "react";
import JSBI from "jsbi";
import { usePositionInfo } from "./useGetPositionIds";
import { Currency, CurrencyAmount } from "@uniswap/sdk-core";
import tryParseCurrencyAmount from "@/utils/token/tryParseCurrencyAmount";
import { useRecoilValue } from "recoil";
import { lastFocusedInput } from "@/recoil/pool/setPoolPosition";

const FixedPoint96Q96 = ethers.BigNumber.from("0x1000000000000000000000000");

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

  const param1 = JSBI.multiply(
    JSBI.BigInt(amount1.toString()),
    JSBI.BigInt(FixedPoint96Q96.toString())
  );
  const param2 = JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96);

  if (JSBI.equal(param1, JSBI.BigInt(0)) || JSBI.equal(param2, JSBI.BigInt(0)))
    return param1;

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

  const param1 = JSBI.multiply(sqrtRatioAX96, sqrtRatioBX96);
  const intermediate = JSBI.divide(
    param1,
    JSBI.BigInt(FixedPoint96Q96.toString())
  );
  const param2 = JSBI.multiply(JSBI.BigInt(amount0.toString()), intermediate);
  const param3 = JSBI.subtract(sqrtRatioBX96, sqrtRatioAX96);
  if (JSBI.equal(param2, JSBI.BigInt(0)) || JSBI.equal(param3, JSBI.BigInt(0)))
    return param2;
  return JSBI.divide(param2, param3);
}

export function useGetAmountForLiquidity() {
  const { info: positionPool } = usePositionInfo();

  const { inToken, outToken } = useInOutTokens();
  const {
    ticks,
    invertPrice,
    deposit0Disabled,
    deposit1Disabled,
    // dependentAmount,
  } = useV3MintInfo();

  const poolForPosition =
    positionPool &&
    new Pool(
      positionPool.token0,
      positionPool.token1,
      positionPool.fee,
      positionPool.sqrtPriceX96,
      JSBI.BigInt(0),
      positionPool.tickCurrent,
      []
    );

  const tickLower = positionPool?.tickLower;
  const tickUpper = positionPool?.tickUpper;
  const currentTick = positionPool?.tickCurrent;
  const token0Address = positionPool?.token0.address;

  const invertAmount: boolean = useMemo(() => {
    if (inToken?.tokenAddress === token0Address) {
      return false;
    }
    return true;
  }, [inToken, token0Address]);

  const lastFocused = useRecoilValue(lastFocusedInput);
  // amounts
  const independentAmount: CurrencyAmount<Currency> | undefined | null =
    lastFocused === "LeftInput" && inToken?.parsedAmount
      ? tryParseCurrencyAmount(inToken?.parsedAmount, inToken?.token)
      : lastFocused === "RightInput" && outToken?.parsedAmount
      ? tryParseCurrencyAmount(outToken?.parsedAmount, outToken?.token)
      : undefined;

  const dependentAmount: CurrencyAmount<Currency> | undefined = useMemo(() => {
    // we wrap the currencies just to get the price in terms of the other token
    const wrappedIndependentAmount = independentAmount?.wrapped;
    const dependentCurrency =
      lastFocused === "LeftInput" ? outToken?.token : inToken?.token;

    if (
      independentAmount &&
      wrappedIndependentAmount &&
      typeof tickLower === "number" &&
      typeof tickUpper === "number" &&
      poolForPosition
    ) {
      // if price is out of range or invalid range - return 0 (single deposit will be independent)
      if (deposit0Disabled || deposit1Disabled) {
        return undefined;
      }

      const position: Position | undefined =
        wrappedIndependentAmount.currency.equals(poolForPosition.token0)
          ? Position.fromAmount0({
              pool: poolForPosition,
              tickLower,
              tickUpper,
              amount0: independentAmount.quotient,
              useFullPrecision: true, // we want full precision for the theoretical position
            })
          : Position.fromAmount1({
              pool: poolForPosition,
              tickLower,
              tickUpper,
              amount1: independentAmount.quotient,
            });

      const dependentTokenAmount = wrappedIndependentAmount.currency.equals(
        poolForPosition.token0
      )
        ? position.amount1
        : position.amount0;
      return (
        dependentCurrency &&
        CurrencyAmount.fromRawAmount(
          dependentCurrency,
          dependentTokenAmount.quotient
        )
      );
    }

    return undefined;
  }, [
    independentAmount,
    deposit0Disabled,
    deposit1Disabled,
    tickLower,
    tickUpper,
    poolForPosition,
    lastFocused,
    inToken?.token,
    outToken?.token,
  ]);

  return {
    amountForToken0: "",
    amountForToken1: "",
    dependentAmount,
  };
}
