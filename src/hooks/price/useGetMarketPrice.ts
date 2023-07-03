import { GET_MARKET_PRICE } from "@/graphql/getMarketPrice";
import { SupportedTokenNames } from "@/types/token/supportedToken";
import { useQuery } from "@apollo/client";
import { useMemo } from "react";

export function useGetMarketPrice(params: {
  tokenName: SupportedTokenNames | string;
}): { tokenMarketPrice: string | null } {
  const { tokenName } = params;
  const { data } = useQuery(GET_MARKET_PRICE, {
    variables: {
      tokenId: tokenName,
    },
    pollInterval: 10000,
    context: {
      apiName: "tosv2",
    },
  });

  const tokenMarketPrice = useMemo(() => {
    if (data?.getTokenPrice.price) {
      return data.getTokenPrice.price;
    }
    return undefined;
  }, [data]);

  return { tokenMarketPrice };
}
