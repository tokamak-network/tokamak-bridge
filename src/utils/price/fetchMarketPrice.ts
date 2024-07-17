import { GET_MARKET_PRICE } from "@/graphql/queries/getMarketPrice";
import {
  changeTokenNameForAPI,
  trimTokenName,
} from "@/hooks/price/useGetMarketPrice";
import { ApolloClient, InMemoryCache } from "@apollo/client";

export async function fetchMarketPrice(
  tokenId: string
): Promise<number | undefined> {
  try {
    const tokenName = changeTokenNameForAPI(tokenId);
    const apolloClient = new ApolloClient({
      uri: process.env.NEXT_PUBLIC_PRICE_API,
      cache: new InMemoryCache(),
    });
    const result = await apolloClient.query({
      query: GET_MARKET_PRICE,
      variables: { tokenName: trimTokenName(tokenName) },
      fetchPolicy: "cache-first",
    });

    if (result.data.getTokenMarketData.current_price)
      return result.data.getTokenMarketData.current_price;
    return undefined;
  } catch (e) {
    // console.log("fetchMarketPrice error");
    // console.log(e);
    return undefined;
  }
}
