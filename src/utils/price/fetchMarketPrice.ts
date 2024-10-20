import { GET_MARKET_PRICE } from "@/graphql/queries/getMarketPrice";
import {
  changeTokenNameForAPI,
  trimTokenName,
} from "@/hooks/price/useGetMarketPrice";
import { ApolloClient, InMemoryCache } from "@apollo/client";

export async function fetchMarketPrice(
  tokenId: string,
): Promise<number | undefined> {
  try {
    const tokenName = changeTokenNameForAPI(tokenId);
    const response = await fetch(`/api/coingecko?tokenName=${tokenName}`);
    if (!response.ok) {
      throw new Error("Failed to fetch the market price");
    }
    const result = await response.json();
    if (result[0].current_price) return result[0].current_price;
    return undefined;
  } catch (e) {
    // console.log("fetchMarketPrice error");
    // console.log(e);
    return undefined;
  }
}
