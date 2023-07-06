import { GET_POOLS } from "@/graphql/data/queries";
import { useQuery } from "@apollo/client";
import { useInOutTokens } from "../token/useInOutTokens";
import { PoolData_Subgraph } from "@/types/pool/subgraph";
import { useMemo } from "react";
import { useGetFeeTier } from "./useGetFeeTier";
import { TICK_SPACINGS, tickToPrice } from "@uniswap/v3-sdk";
import useConnectedNetwork from "../network";
import { Token } from "@uniswap/sdk-core";
import { useNetwork } from "wagmi";

const existPool = (poolData: PoolData_Subgraph) => {
  if (poolData === undefined) return false;
  if (poolData.asToken0.length === 0 && poolData.asToken1.length === 0)
    return false;
  if (poolData.asToken0.length === 1) return poolData.asToken0[0];
  if (poolData.asToken1.length === 1) return poolData.asToken1[0];
  return false;
};

export function usePoolData(): {
  poolData: PoolData_Subgraph;
} {
  const { inToken, outToken } = useInOutTokens();
  const { feeTier } = useGetFeeTier();
  const { layer, isConnectedToMainNetwork } = useConnectedNetwork();

  const { data } = useQuery(GET_POOLS, {
    variables: {
      token0: inToken?.tokenAddress?.toLocaleLowerCase(),
      token1: outToken?.tokenAddress?.toLowerCase(),
      feeTier: feeTier?.toString(),
    },
    pollInterval: 10000,
  });

  console.log(data);

  return { poolData: data };
}

export function useConstructPosition() {
  const { poolData } = usePoolData();

  const poolPosition = useMemo(() => {
    const pool = existPool(poolData);
    if (pool) {
      return pool;
    }
  }, [poolData]);

  return { poolPosition };
}

export function usePoolPrice() {
  const { poolPosition } = useConstructPosition();
  const { inToken, outToken } = useInOutTokens();

  const tokenPrice = useMemo(() => {
    if (poolPosition) {
      const { token0, token1, token0Price, token1Price } = poolPosition;
      if (token0.id === inToken?.tokenAddress?.toLocaleLowerCase()) {
        return { token0Price, token1Price };
      }
      if (token1.id === inToken?.tokenAddress?.toLocaleLowerCase()) {
        return { token0Price: token1Price, token1Price: token0Price };
      }
    }
  }, [poolPosition, inToken, outToken]);

  return { tokenPrice };
}

export function usePoolToken() {
  const { poolPosition } = useConstructPosition();
  const { connectedChainId } = useConnectedNetwork();
  const { chain } = useNetwork();

  const tickToPriceParams = useMemo(() => {
    if (poolPosition) {
      const baseToken = new Token(
        chain?.id ?? 1,
        poolPosition.token0.id,
        Number(poolPosition.token0.decimals)
      );
      const quoteToken = new Token(
        chain?.id ?? 1,
        poolPosition.token1.id,
        Number(poolPosition.token1.decimals)
      );

      return { baseToken, quoteToken, tick: Number(poolPosition.tick) };
    }
  }, [poolPosition, connectedChainId]);

  return { tickToPriceParams };
}

export function usePriceTickConversion(tick?: number) {
  const { tickToPriceParams } = usePoolToken();

  if (tickToPriceParams === undefined) {
    return { currentPrice: undefined };
  }

  const currentPrice = tickToPrice(
    tickToPriceParams.baseToken,
    tickToPriceParams.quoteToken,
    tick ?? tickToPriceParams?.tick
  );

  console.log("TICK_SPACINGS");

  console.log(TICK_SPACINGS);

  return { currentPrice: currentPrice.toSignificant(6) };
}

export function useTickPriceConvertion() {}
