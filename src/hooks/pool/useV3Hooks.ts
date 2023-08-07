import { Currency, Rounding } from "@uniswap/sdk-core";
import { FeeAmount, Pool, TICK_SPACINGS, tickToPrice } from "@uniswap/v3-sdk";
import { useCallback, useEffect, useMemo } from "react";
import { useV3MintInfo } from "./useV3MintInfo";
import { Bound, PoolState } from "@/types/pool/pool";
import { usePool } from "./usePool";
import { useGetFeeTier } from "./useGetFeeTier";
import { useRecoilState } from "recoil";
import {
  atMaxTick,
  atMinTick,
  maxPrice,
  minPrice,
} from "@/recoil/pool/setPoolPosition";

export function useRangeHopCallbacks() {
  // baseCurrency: Currency | undefined,
  // quoteCurrency: Currency | undefined,
  // feeAmount: FeeAmount | undefined,
  // tickLower: number | undefined,
  // tickUpper: number | undefined,
  // pool?: Pool | undefined | null
  const { feeTier: feeAmount } = useGetFeeTier();
  const [poolStatus, poolData] = usePool();
  const { ticks, pricesAtLimit, poolForPosition } = useV3MintInfo();
  // get value and prices at ticks
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks;

  const pool = poolStatus === PoolState.EXISTS ? poolData : poolForPosition;

  const baseCurrency = pool?.token0;
  const quoteCurrency = pool?.token1;

  const baseToken = useMemo(() => baseCurrency?.wrapped, [baseCurrency]);
  const quoteToken = useMemo(() => quoteCurrency?.wrapped, [quoteCurrency]);

  const getDecrementLower = useCallback(() => {
    if (baseToken && quoteToken && typeof tickLower === "number" && feeAmount) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        tickLower - TICK_SPACINGS[feeAmount]
      );

      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }

    // use pool current tick as starting tick if we have pool but no tick input
    if (
      !(typeof tickLower === "number") &&
      baseToken &&
      quoteToken &&
      feeAmount &&
      pool
    ) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        pool.tickCurrent - TICK_SPACINGS[feeAmount]
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    return "";
  }, [baseToken, quoteToken, tickLower, feeAmount, pool]);

  const getIncrementLower = useCallback(() => {
    if (baseToken && quoteToken && typeof tickLower === "number" && feeAmount) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        tickLower + TICK_SPACINGS[feeAmount]
      );

      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (
      !(typeof tickLower === "number") &&
      baseToken &&
      quoteToken &&
      feeAmount &&
      pool
    ) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        pool.tickCurrent + TICK_SPACINGS[feeAmount]
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    return "";
  }, [baseToken, quoteToken, tickLower, feeAmount, pool]);

  const getDecrementUpper = useCallback(() => {
    if (baseToken && quoteToken && typeof tickUpper === "number" && feeAmount) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        tickUpper - TICK_SPACINGS[feeAmount]
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (
      !(typeof tickUpper === "number") &&
      baseToken &&
      quoteToken &&
      feeAmount &&
      pool
    ) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        pool.tickCurrent - TICK_SPACINGS[feeAmount]
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    return "";
  }, [baseToken, quoteToken, tickUpper, feeAmount, pool]);

  const getIncrementUpper = useCallback(() => {
    if (baseToken && quoteToken && typeof tickUpper === "number" && feeAmount) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        tickUpper + TICK_SPACINGS[feeAmount]
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (
      !(typeof tickUpper === "number") &&
      baseToken &&
      quoteToken &&
      feeAmount &&
      pool
    ) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        pool.tickCurrent + TICK_SPACINGS[feeAmount]
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    return "";
  }, [baseToken, quoteToken, tickUpper, feeAmount, pool]);

  const [isAtMinTick, setAtMinTick] = useRecoilState(atMinTick);
  const [isAtMaxTick, setAtMaxTick] = useRecoilState(atMaxTick);

  //need to bind with Recoil
  const getSetFullRange = useCallback(() => {
    if (pricesAtLimit) {
      const lowerLimitPrice = pricesAtLimit.LOWER?.toSignificant(5);
      const upperLimitPrice = pricesAtLimit.UPPER?.toSignificant(5);
      setMinPrice(lowerLimitPrice);
      setMaxPrice(upperLimitPrice);
      setAtMinTick(true);
      setAtMaxTick(true);
    }
  }, [pricesAtLimit]);

  const [, setMinPrice] = useRecoilState(minPrice);
  const [, setMaxPrice] = useRecoilState(maxPrice);

  const onDecreaseLower = useCallback(() => {
    const result = getDecrementLower();
    if (result) return setMinPrice(result);
  }, [getDecrementLower]);

  const onIncreaseLower = useCallback(() => {
    const result = getIncrementLower();
    if (result) return setMinPrice(result);
  }, [getIncrementLower]);

  const onDecreaseUpper = useCallback(() => {
    const result = getDecrementUpper();
    if (result) return setMaxPrice(result);
  }, [getDecrementUpper]);

  const onIncreaseUpper = useCallback(() => {
    const result = getIncrementUpper();
    console.log("result");
    console.log(result);

    if (result) return setMaxPrice(result);
  }, [getIncrementUpper]);

  const getInputTickToPrice = useCallback(() => {}, []);

  return {
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
    getSetFullRange,
    onDecreaseLower,
    onIncreaseLower,
    onDecreaseUpper,
    onIncreaseUpper,
  };
}
