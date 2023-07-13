import {
  FeeAmount,
  Pool,
  TICK_SPACINGS,
  TickMath,
  encodeSqrtRatioX96,
  nearestUsableTick,
  priceToClosestTick,
} from "@uniswap/v3-sdk";
import { useMemo } from "react";
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
import { Field } from "@/types/swap/swap";
import { useRecoilValue } from "recoil";
import { initialPrice } from "@/recoil/pool/setPoolPosition";

export function useV3MintInfo() {
  const { feeTier: feeAmount } = useGetFeeTier();
  const [poolState, pool] = usePool();
  const noLiquidity = poolState === PoolState.NOT_EXISTS;
  const { inToken, outToken } = useInOutTokens();
  const { minPriceInput, maxPriceInput } = useGetPoolInput();
  const startPriceTypedValue = useRecoilValue(initialPrice);

  //note to parse inputs in reverse
  const invertPrice = Boolean(
    inToken?.token && pool?.token0 && !inToken.token.equals(pool.token0)
  );

  // formatted with tokens
  const [tokenA, tokenB, baseToken] = useMemo(
    () => [
      inToken?.token?.wrapped,
      outToken?.token?.wrapped,
      pool?.token0.wrapped,
    ],
    [inToken?.token, outToken?.token, pool?.token0]
  );

  const [token0, token1] = useMemo(
    () =>
      tokenA && tokenB
        ? tokenA.sortsBefore(tokenB)
          ? [tokenA, tokenB]
          : [tokenB, tokenA]
        : [undefined, undefined],
    [tokenA, tokenB]
  );

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
        // typeof existingPosition?.tickLower === "number"
        //   ? existingPosition.tickLower
        //   : (invertPrice && typeof rightRangeTypedValue === "boolean") ||
        //     (!invertPrice && typeof leftRangeTypedValue === "boolean")
        //   ? tickSpaceLimits[Bound.LOWER]
        //             :
        invertPrice
          ? tryParseTick(token1, token0, feeAmount, maxPriceInput?.toString())
          : tryParseTick(token0, token1, feeAmount, minPriceInput?.toString()),
      [Bound.UPPER]:
        // typeof existingPosition?.tickUpper === "number"
        //   ? existingPosition.tickUpper
        //   : (!invertPrice && typeof rightRangeTypedValue === "boolean") ||
        //     (invertPrice && typeof leftRangeTypedValue === "boolean")
        //   ? tickSpaceLimits[Bound.UPPER]
        //           :
        invertPrice
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
  ]);

  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks || {};

  console.log("tickLower");
  console.log(tickLower);

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

  //   console.log("**result");
  //   console.log(
  //     "pool :",
  //     pool,
  //     "poolState : ",
  //     poolState,
  //     "ticks : ",
  //     ticks,
  //     "price : ",
  //     price,
  //     "pricesAtTicks : ",
  //     pricesAtTicks,
  //     "pricesAtLimit : ",
  //     pricesAtLimit,
  //     noLiquidity,
  //     invalidPool,
  //     invalidRange,
  //     outOfRange,
  //     invertPrice,
  //     ticksAtLimit
  //   );

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
    ticksAtLimit,
    deposit0Disabled,
    deposit1Disabled,
    tickSpaceLimits,
    poolForPosition,
  };
}

export function useGetPool() {
  const { noLiquidity, poolForPosition } = useV3MintInfo();
  const [, pool] = usePool();

  return { pool: noLiquidity ? poolForPosition : poolForPosition };
}
