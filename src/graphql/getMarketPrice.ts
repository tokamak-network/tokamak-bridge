import { gql } from "@apollo/client";

const GET_MARKET_PRICE = gql`
  query GetTokenPrice($tokenId: String!) @api(contextKey: "apiName") {
    getTokenPrice(tokenId: $tokenId) {
      price
    }
  }
`;

export { GET_MARKET_PRICE };
