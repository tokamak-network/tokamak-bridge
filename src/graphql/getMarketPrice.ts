import { gql } from "@apollo/client";

const GET_MARKET_PRICE = gql`
  query GetTokenPrice($tokenId: String!) {
    getTokenPrice(tokenId: $tokenId) {
      price
    }
  }
`;

export { GET_MARKET_PRICE };
