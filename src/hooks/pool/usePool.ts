import { GET_POOLS } from "@/graphql/data/queries";
import { useQuery } from "@apollo/client";
import { useInOutTokens } from "../token/useInOutTokens";
import { poolData } from "@/types/pool/subgraph";

export function usePool(): {
  poolData: { asToken0: poolData[]; asToken1: poolData[] } | undefined;
} {
  const { inToken, outToken } = useInOutTokens();
  const { data } = useQuery(GET_POOLS, {
    variables: {
      token0: inToken?.tokenAddress?.toLocaleLowerCase(),
      token1: outToken?.tokenAddress?.toLowerCase(),
    },
    pollInterval: 10000,
  });

  return { poolData: data };
}
