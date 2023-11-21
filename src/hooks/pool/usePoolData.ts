import { GET_POOLS } from "@/graphql/data/queries";
import { useQuery } from "@apollo/client";
import { useInOutTokens } from "../token/useInOutTokens";
import { PoolData_Subgraph } from "@/types/pool/subgraph";
import { useEffect, useMemo, useState } from "react";
import { useGetFeeTier } from "./useGetFeeTier";
import { tickToPrice } from "@uniswap/v3-sdk";
import useConnectedNetwork from "../network";
import { Price, Token } from "@uniswap/sdk-core";
import { useNetwork } from "wagmi";
import { useRecoilState } from "recoil";
import {
  baseToken,
  currentTick,
  quoteToken,
} from "@/recoil/pool/setPoolPosition";
import { usePool } from "./usePool";
import { useV3MintInfo } from "./useV3MintInfo";
import { Bound, PoolState } from "@/types/pool/pool";
import {
  maxPrice as maxPriceStatus,
  minPrice as minPriceStatus,
} from "@/recoil/pool/setPoolPosition";
import { useRangeHopCallbacks } from "./useV3Hooks";
import { useTicks } from "./useTicks";

// const existPool = (poolData: PoolData_Subgraph) => {
//   if (poolData === undefined) return false;
//   if (poolData.asToken0.length === 0 && poolData.asToken1.length === 0)
//     return false;
//   if (poolData.asToken0.length === 1) return poolData.asToken0[0];
//   if (poolData.asToken1.length === 1) return poolData.asToken1[0];
//   return false;
// };

// export function usePoolData(): {
//   poolData: PoolData_Subgraph;
// } {
//   const { inToken, outToken } = useInOutTokens();
//   const { feeTier } = useGetFeeTier();
//   const { layer, isConnectedToMainNetwork } = useConnectedNetwork();

//   const { data } = useQuery(GET_POOLS, {
//     variables: {
//       token0: inToken?.tokenAddress?.toLocaleLowerCase(),
//       token1: outToken?.tokenAddress?.toLowerCase(),
//       feeTier: feeTier?.toString(),
//     },
//     pollInterval: 10000,
//   });

//   return { poolData: data };
// }

// export function useConstructPosition() {
//   const { poolData } = usePoolData();

//   const poolPosition = useMemo(() => {
//     const pool = existPool(poolData);
//     if (pool) {
//       return pool;
//     }
//   }, [poolData]);

//   return { poolPosition };
// }

// export function usePoolPrice() {
//   const { poolPosition } = useConstructPosition();
//   const { inToken, outToken } = useInOutTokens();
//   const { feeTier } = useGetFeeTier();

//   const test = usePool();
//   const test2 = useV3MintInfo();

//   const tokenPrice = useMemo(() => {
//     if (poolPosition) {
//       const { token0, token1, token0Price, token1Price } = poolPosition;
//       if (token0.id === inToken?.tokenAddress?.toLocaleLowerCase()) {
//         return { token0Price, token1Price };
//       }
//       if (token1.id === inToken?.tokenAddress?.toLocaleLowerCase()) {
//         return { token0Price: token1Price, token1Price: token0Price };
//       }
//     }
//   }, [poolPosition, inToken, outToken]);

//   return { tokenPrice };
// }

// export function usePoolToken() {
//   const { poolPosition } = useConstructPosition();
//   const { connectedChainId } = useConnectedNetwork();
//   const { chain } = useNetwork();

//   const [, setBaseToken] = useRecoilState(baseToken);
//   const [, setQuoteToken] = useRecoilState(quoteToken);
//   const [, setCurrentTick] = useRecoilState(currentTick);

//   const tickToPriceParams = useMemo(() => {
//     if (poolPosition) {
//       const baseToken = new Token(
//         chain?.id ?? 1,
//         poolPosition.token0.id,
//         Number(poolPosition.token0.decimals)
//       );
//       const quoteToken = new Token(
//         chain?.id ?? 1,
//         poolPosition.token1.id,
//         Number(poolPosition.token1.decimals)
//       );

//       return { baseToken, quoteToken, tick: Number(poolPosition.tick) };
//     }
//   }, [poolPosition, connectedChainId]);

//   //set values on Recoil
//   useEffect(() => {
//     if (tickToPriceParams) {
//       setBaseToken(tickToPriceParams.baseToken);
//       setQuoteToken(tickToPriceParams.quoteToken);
//       setCurrentTick(tickToPriceParams.tick);
//     }
//   }, [tickToPriceParams]);

//   return { tickToPriceParams };
// }

export function usePriceTickConversion() {
  //using subgraph data
  // const { tickToPriceParams } = usePoolToken();
  //using contract call
  const [, pool] = usePool();
  // const { ticksAtLimit, tickSpaceLimits, deposit0Disabled, deposit1Disabled } =
  //   useV3MintInfo();

  // const [, setMinPrice] = useRecoilState(minPriceStatus);
  // const [, setMaxPrice] = useRecoilState(maxPriceStatus);
  const { inToken } = useInOutTokens();

  const { currentTick } = useTicks();

  const baseToken = pool?.token0;
  const quoteToken = pool?.token1;

  const invertPrice = Boolean(
    inToken?.token && pool?.token0 && !inToken.token.equals(pool.token0)
  );

  const currentPrice = useMemo(() => {
    if (baseToken && quoteToken && currentTick)
      return tickToPrice(baseToken, quoteToken, currentTick);
  }, [baseToken, quoteToken, currentTick]);

  // const priceIsUpdated = useMemo(() => {
  //   if (
  //     currentTick !== undefined &&
  //     oldCurrentTick !== undefined &&
  //     currentTick !== oldCurrentTick
  //   ) {
  //     setOldCurrentTick(currentTick);
  //     return true;
  //   }
  //   setOldCurrentTick(currentTick);
  //   return false;
  // }, [currentTick]);

  // const minPrice = useMemo(() => {
  //   if (baseToken && quoteToken && currentTick !== undefined && ticksAtLimit)
  //     return tickToPrice(
  //       baseToken,
  //       quoteToken,
  //       Boolean(ticksAtLimit[Bound.LOWER]) &&
  //         tickSpaceLimits?.LOWER !== undefined
  //         ? tickSpaceLimits.LOWER
  //         : currentTick && currentTick - 6932 < -887272
  //         ? currentTick
  //         : currentTick && currentTick - 6932
  //     );
  // }, [baseToken, quoteToken, currentTick, ticksAtLimit, tickSpaceLimits]);

  // const maxPrice = useMemo(() => {
  //   if (baseToken && quoteToken && currentTick && ticksAtLimit)
  //     return tickToPrice(
  //       baseToken,
  //       quoteToken,
  //       Boolean(ticksAtLimit[Bound.UPPER]) &&
  //         tickSpaceLimits?.UPPER !== undefined
  //         ? tickSpaceLimits.UPPER
  //         : currentTick + 6932
  //     );
  // }, [baseToken, quoteToken, currentTick, ticksAtLimit, tickSpaceLimits]);

  // const [initialized, setInitialized] = useState<boolean>(false);

  return {
    currentPrice: invertPrice
      ? currentPrice?.invert().toSignificant(10)
      : currentPrice?.toSignificant(10),
    invertPrice,
    // priceIsUpdated,
  };
}

export function useTickPriceConvertion() {}
