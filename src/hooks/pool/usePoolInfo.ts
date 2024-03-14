import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import { Price, Token } from "@uniswap/sdk-core";
import { usePool } from "@/hooks/pool/usePool";
import { useMemo, useState } from "react";
import {
  Position,
  TICK_SPACINGS,
  TickMath,
  nearestUsableTick,
  tickToPrice,
} from "@uniswap/v3-sdk";
import { getRatio } from "@/utils/uniswap/pool/getRatio";
import {
  DAI,
  USDC_MAINNET,
  USDT,
  WBTC,
  WRAPPED_NATIVE_CURRENCY,
} from "constant/uniswap/tokens";
import { Bound } from "@/types/pool/pool";
import { useRecoilValue } from "recoil";
import { ATOM_manuallyInverted } from "@/recoil/pool/positions";
import { useGetMode } from "../mode/useGetMode";
import { PoolCardDetail } from "@/app/pools/components/PoolCard";

function getPriceOrderingFromPositionForUI(position?: Position): {
  priceLower?: Price<Token, Token>;
  priceUpper?: Price<Token, Token>;
  quote?: Token;
  base?: Token;
} {
  if (!position) {
    return {};
  }

  const token0 = position.amount0.currency;
  const token1 = position.amount1.currency;

  // if token0 is a dollar-stable asset, set it as the quote token
  const stables = [DAI, USDC_MAINNET, USDT];
  if (stables.some((stable) => stable.equals(token0))) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    };
  }

  // if token1 is an ETH-/BTC-stable asset, set it as the base token
  const bases = [...Object.values(WRAPPED_NATIVE_CURRENCY), WBTC];
  if (bases.some((base) => base && base.equals(token1))) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    };
  }

  // if both prices are below 1, invert
  if (position.token0PriceUpper.lessThan(1)) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    };
  }

  // otherwise, just return the default
  return {
    priceLower: position.token0PriceLower,
    priceUpper: position.token0PriceUpper,
    quote: token1,
    base: token0,
  };
}

const useInverter = ({
  priceLower,
  priceUpper,
  quote,
  base,
  invert,
}: {
  priceLower?: Price<Token, Token>;
  priceUpper?: Price<Token, Token>;
  quote?: Token;
  base?: Token;
  invert?: boolean;
}): {
  priceLower?: Price<Token, Token>;
  priceUpper?: Price<Token, Token>;
  quote?: Token;
  base?: Token;
} => {
  return {
    priceUpper: invert ? priceLower?.invert() : priceUpper,
    priceLower: invert ? priceUpper?.invert() : priceLower,
    quote: invert ? base : quote,
    base: invert ? quote : base,
  };
};

export function usePoolInfo() {
  const { subMode } = useGetMode();
  const { info } = usePositionInfo();

  if (info === undefined || subMode.add === true) {
    return {
      priceLower: undefined,
      priceUpper: undefined,
      inverted: undefined,
      ratio: undefined,
    };
  }

  const { token0, token1, fee, liquidity, tickLower, tickUpper, tickCurrent } =
    info;

  // construct Position from details returned
  const [, pool] = usePool(token0, token1, fee);

  const position = useMemo(() => {
    if (pool && liquidity && tickLower && tickUpper) {
      //trouble
      return new Position({
        pool,
        liquidity: liquidity.toString(),
        tickLower,
        tickUpper,
      });
    }
    return undefined;
  }, [liquidity, pool, tickLower, tickUpper]);

  const pricesFromPosition = getPriceOrderingFromPositionForUI(position);
  const manuallyInverted = useRecoilValue(ATOM_manuallyInverted);

  // handle manual inversion
  const { priceLower, priceUpper, base } = useInverter({
    priceLower: pricesFromPosition.priceLower,
    priceUpper: pricesFromPosition.priceUpper,
    quote: pricesFromPosition.quote,
    base: pricesFromPosition.base,
    invert: manuallyInverted,
  });

  const inverted = token1 ? base?.equals(token1) : undefined;

  const ratio = useMemo(() => {
    return priceLower && pool && priceUpper
      ? getRatio(
          inverted ? priceUpper.invert() : priceLower,
          pool?.token0Price,
          inverted ? priceLower.invert() : priceUpper
        )
      : undefined;
  }, [pool, priceLower, priceUpper, inverted]);

  const currentPrice = useMemo(() => {
    if (token0 && token1 && tickCurrent)
      return tickToPrice(token0, token1, tickCurrent);
  }, [token0, token1, tickCurrent]);

  // lower and upper limits in the tick space for `feeAmoun<Trans>
  const tickSpaceLimits = useMemo(
    () => ({
      [Bound.LOWER]: fee
        ? nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[fee])
        : undefined,
      [Bound.UPPER]: fee
        ? nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[fee])
        : undefined,
    }),
    [fee]
  );

  const ticksAtLimit = useMemo(
    () => ({
      [Bound.LOWER]: fee && tickLower === tickSpaceLimits.LOWER,
      [Bound.UPPER]: fee && tickUpper === tickSpaceLimits.UPPER,
    }),
    [tickSpaceLimits, tickLower, tickUpper, fee]
  );

  // single deposit only if price is out of range
  const deposit0Disabled = Boolean(
    typeof tickUpper === "number" && info && tickCurrent >= tickUpper
  );
  const deposit1Disabled = Boolean(
    typeof tickLower === "number" && info && tickCurrent <= tickLower
  );

  return {
    priceLower,
    priceUpper,
    currentPrice: inverted
      ? currentPrice?.invert().toSignificant(6)
      : currentPrice?.toSignificant(6),
    inverted,
    ratio,
    tickSpaceLimits,
    ticksAtLimit,
    pool,
    deposit0Disabled,
    deposit1Disabled,
  };
}
