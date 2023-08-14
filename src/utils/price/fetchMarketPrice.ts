import { apolloClient } from "@/apollo";
import { GET_MARKET_PRICE } from "@/graphql/getMarketPrice";
import { changeTokenNameForAPI } from "@/hooks/price/useGetMarketPrice";

export async function fetchMarketPrice(tokenId: string) {
  try {
    const tokenName = changeTokenNameForAPI(tokenId);
    const result = await apolloClient.query({
      query: GET_MARKET_PRICE,
      variables: { tokenName },
      context: {
        apiName: "price",
      },
    });
    if (result.data.getTokenMarketData.current_price)
      return result.data.getTokenMarketData.current_price;
    return undefined;
  } catch (e) {
    return undefined;
  }
}
