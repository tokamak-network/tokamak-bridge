import { useQuery } from "@apollo/client";
import useConnectedNetwork from "../network";
import { subgraphApolloClients } from "@/graphql/thegraph/apollo";
import ms from "ms";
import { useGetFeeTier } from "./useGetFeeTier";
import { useInOutTokens } from "../token/useInOutTokens";
import { GET_POOLS } from "@/graphql/data/queries";
import { useMemo } from "react";

export function useTicks() {
  const { connectedChainId } = useConnectedNetwork();
  const { inToken, outToken } = useInOutTokens();
  const { feeTier } = useGetFeeTier();
  const { data, loading, error } = useQuery(GET_POOLS, {
    variables: {
      token0: inToken?.tokenAddress?.toLocaleLowerCase(),
      token1: outToken?.tokenAddress?.toLowerCase(),
      feeTier: feeTier?.toString(),
    },
    pollInterval: ms(`10s`),
    client: connectedChainId
      ? subgraphApolloClients[connectedChainId]
      : undefined,
  });

  return useMemo(
    () => ({
      error,
      loading,
      currentTick:
        data?.asToken0.length === 1
          ? Number(data?.asToken0[0].tick)
          : data?.asToken1.length === 1
          ? Number(data?.asToken1[0].tick)
          : undefined,
    }),
    [data, error, loading]
  );
}
