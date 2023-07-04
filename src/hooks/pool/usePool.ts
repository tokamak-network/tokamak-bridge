import { GET_POOL } from "@/graphql/data/queries";
import { useQuery } from "@apollo/client";
import { useInOutTokens } from "../token/useInOutTokens";
import { poolData } from "@/types/pool/subgraph";

export function usePool(): {
  poolData: { asToken0: poolData[]; asToken1: poolData[] } | undefined;
} {
  const { inToken, outToken } = useInOutTokens();
  const { data } = useQuery(GET_POOL, {
    variables: {
      token0: inToken?.tokenAddress,
      token1: outToken?.tokenAddress,
    },
    pollInterval: 10000,
  });

  return { poolData: data };
}
