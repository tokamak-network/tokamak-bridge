import {
  FeeAmount,
  Pool,
  Position,
  TICK_SPACINGS,
  TickMath,
  encodeSqrtRatioX96,
  nearestUsableTick,
  priceToClosestTick,
} from "@uniswap/v3-sdk";
import { useEffect, useMemo } from "react";
import { useGetFeeTier } from "./useGetFeeTier";
import { usePool } from "./usePool";
import { Bound, PoolState } from "@/types/pool/pool";
import JSBI from "jsbi";
import { useInOutTokens } from "../token/useInOutTokens";
import tryParseCurrencyAmount from "@/utils/token/tryParseCurrencyAmount";
import { Currency, CurrencyAmount, Price, Token } from "@uniswap/sdk-core";
import { tryParseTick } from "@/utils/pool/tryParseTick";
import { useGetPoolInput } from "./useGetPoolInput";
import { getTickToPrice } from "@/utils/pool/getTickToPrice";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  atMaxTick,
  atMinTick,
  initialPrice,
  lastFocusedInput,
} from "@/recoil/pool/setPoolPosition";
import { useGetMode } from "../mode/useGetMode";

export function useV3MintInfo() {
  const { feeTier: feeAmount } = useGetFeeTier();
  const [poolState, pool] = usePool();

  const noLiquidity = poolState === PoolState.NOT_EXISTS;
  const { inToken, outToken } = useInOutTokens();
  const { minPriceInput, maxPriceInput } = useGetPoolInput();
  const startPriceTypedValue = useRecoilValue(initialPrice);
  const [isAtMinTick] = useRecoilState(atMinTick);
  const [isAtMaxTick] = useRecoilState(atMaxTick);

  // formatted with tokens
  const [tokenA, tokenB, baseToken] = useMemo(
    () => [
      inToken?.token?.wrapped,
      outToken?.token?.wrapped,
      pool?.token0.wrapped ?? inToken?.token?.wrapped,
    ],
    [inToken?.token, outToken?.token, pool?.token0]
  );

  const { subMode } = useGetMode();

  const [token0, token1] = useMemo(
    () =>
      tokenA && tokenB && subMode.add && tokenA.address !== tokenB.address
        ? tokenA.sortsBefore(tokenB)
          ? [tokenA, tokenB]
          : [tokenB, tokenA]
        : [undefined, undefined],
    [tokenA, tokenB, subMode.add]
  );

  /*note to parse inputs in reverse
  use pool data from the hook if it was initialized.
  use tokens sorted if it's not initialized becuase pool is null.
  It's related to the problem token is not sorted when it's not initialized and try to mint
  */
  const invertPrice = pool?.token0
    ? Boolean(
        inToken?.token && pool?.token0 && !inToken.token.equals(pool.token0)
      )
    : Boolean(baseToken && token0 && !baseToken.equals(token0));

  //   always returns the price with 0 as base token
  const price: Price<Token, Token> | undefined = useMemo(() => {
    // if no liquidity use typed value
    if (noLiquidity && startPriceTypedValue) {
      const parsedQuoteAmount = tryParseCurrencyAmount(
        //initiali price
        startPriceTypedValue,
        invertPrice ? token0 : token1
      );
      if (parsedQuoteAmount && token0 && token1) {
        const baseAmount = tryParseCurrencyAmount(
          "1",
          invertPrice ? token1 : token0
        );
        const price =
          baseAmount && parsedQuoteAmount
            ? new Price(
                baseAmount.currency,
                parsedQuoteAmount.currency,
                baseAmount.quotient,
                parsedQuoteAmount.quotient
              )
            : undefined;
        return (invertPrice ? price?.invert() : price) ?? undefined;
      }
      return undefined;
    } else {
      // get the amount of quote currency
      return pool && token0 ? pool.priceOf(token0) : undefined;
    }
  }, [noLiquidity, invertPrice, token1, token0, pool, startPriceTypedValue]);

  // check for invalid price input (converts to invalid ratio)
  const invalidPrice = useMemo(() => {
    const sqrtRatioX96 = price
      ? encodeSqrtRatioX96(price.numerator, price.denominator)
      : undefined;
    return (
      price &&
      sqrtRatioX96 &&
      !(
        JSBI.greaterThanOrEqual(sqrtRatioX96, TickMath.MIN_SQRT_RATIO) &&
        JSBI.lessThan(sqrtRatioX96, TickMath.MAX_SQRT_RATIO)
      )
    );
  }, [price]);

  // used for ratio calculation when pool not initialized
  const mockPool = useMemo(() => {
    if (tokenA && tokenB && feeAmount && price && !invalidPrice) {
      const currentTick = priceToClosestTick(price);
      const currentSqrt = TickMath.getSqrtRatioAtTick(currentTick);

      return new Pool(
        tokenA,
        tokenB,
        feeAmount,
        currentSqrt,
        JSBI.BigInt(0),
        currentTick,
        []
      );
    } else {
      return undefined;
    }
  }, [feeAmount, invalidPrice, price, tokenA, tokenB]);

  // if pool exists use it, if not use the mock pool
  const poolForPosition: Pool | undefined = pool ?? mockPool;

  // lower and upper limits in the tick space for `feeAmoun<Trans>
  const tickSpaceLimits = useMemo(
    () => ({
      [Bound.LOWER]: feeAmount
        ? nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount])
        : undefined,
      [Bound.UPPER]: feeAmount
        ? nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeAmount])
        : undefined,
    }),
    [feeAmount]
  );

  // parse typed range values and determine closest ticks
  // lower should always be a smaller tick
  const ticks = useMemo(() => {
    return {
      [Bound.LOWER]:
        (invertPrice && isAtMaxTick) || (!invertPrice && isAtMinTick)
          ? tickSpaceLimits[Bound.LOWER]
          : invertPrice
          ? tryParseTick(token1, token0, feeAmount, maxPriceInput?.toString())
          : tryParseTick(token0, token1, feeAmount, minPriceInput?.toString()),
      [Bound.UPPER]:
        (!invertPrice && isAtMaxTick) || (invertPrice && isAtMinTick)
          ? tickSpaceLimits[Bound.UPPER]
          : invertPrice
          ? tryParseTick(token1, token0, feeAmount, minPriceInput?.toString())
          : tryParseTick(token0, token1, feeAmount, maxPriceInput?.toString()),
    };
  }, [
    // existingPosition,
    feeAmount,
    invertPrice,
    minPriceInput,
    maxPriceInput,
    token0,
    token1,
    tickSpaceLimits,
    isAtMinTick,
    isAtMaxTick,
  ]);

  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks || {};

  // specifies whether the lower and upper ticks is at the exteme bounds
  const ticksAtLimit = useMemo(
    () => ({
      [Bound.LOWER]: feeAmount && tickLower === tickSpaceLimits.LOWER,
      [Bound.UPPER]: feeAmount && tickUpper === tickSpaceLimits.UPPER,
    }),
    [tickSpaceLimits, tickLower, tickUpper, feeAmount]
  );

  // mark invalid range
  const invalidRange = Boolean(
    typeof tickLower === "number" &&
      typeof tickUpper === "number" &&
      tickLower >= tickUpper
  );

  const pricesAtLimit = useMemo(() => {
    return {
      [Bound.LOWER]: getTickToPrice(token0, token1, tickSpaceLimits.LOWER),
      [Bound.UPPER]: getTickToPrice(token0, token1, tickSpaceLimits.UPPER),
    };
  }, [token0, token1, tickSpaceLimits.LOWER, tickSpaceLimits.UPPER]);

  // always returns the price with 0 as base token
  const pricesAtTicks = useMemo(() => {
    return {
      [Bound.LOWER]: getTickToPrice(token0, token1, ticks[Bound.LOWER]),
      [Bound.UPPER]: getTickToPrice(token0, token1, ticks[Bound.UPPER]),
    };
  }, [token0, token1, ticks]);
  const { [Bound.LOWER]: lowerPrice, [Bound.UPPER]: upperPrice } =
    pricesAtTicks;

  // liquidity range warning
  const outOfRange = Boolean(
    !invalidRange &&
      price &&
      lowerPrice &&
      upperPrice &&
      (price.lessThan(lowerPrice) || price.greaterThan(upperPrice))
  );

  // single deposit only if price is out of range
  const deposit0Disabled = Boolean(
    typeof tickUpper === "number" &&
      poolForPosition &&
      poolForPosition.tickCurrent >= tickUpper
  );
  const deposit1Disabled = Boolean(
    typeof tickLower === "number" &&
      poolForPosition &&
      poolForPosition.tickCurrent <= tickLower
  );

  const invalidPool = poolState === PoolState.INVALID;
  const notExistPool = poolState === PoolState.NOT_EXISTS;

  const token0Address = pool?.token0.address;
  const invertTokenPair: boolean = useMemo(() => {
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
      if (outOfRange || invalidRange) {
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
    outOfRange,
    tickLower,
    tickUpper,
    poolForPosition,
    invalidRange,
    lastFocused,
    inToken?.token,
    outToken?.token,
  ]);

  return {
    pool,
    poolState,
    ticks,
    price,
    pricesAtTicks,
    pricesAtLimit,
    noLiquidity,
    invalidPool,
    notExistPool,
    invalidRange,
    outOfRange,
    invertPrice,
    invertTokenPair,
    ticksAtLimit,
    deposit0Disabled: invertPrice ? deposit1Disabled : deposit0Disabled,
    deposit1Disabled: invertPrice ? deposit0Disabled : deposit1Disabled,
    tickSpaceLimits,
    poolForPosition,
    dependentAmount,
    currencyA: token0,
    currencyB: token1,
    fee: feeAmount,
  };
}

export function useGetPool() {
  const { noLiquidity, poolForPosition } = useV3MintInfo();
  const [, pool] = usePool();

  return { pool: noLiquidity ? poolForPosition : pool };
}
