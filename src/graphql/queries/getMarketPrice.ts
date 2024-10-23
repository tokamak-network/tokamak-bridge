import { gql } from "@apollo/client";

const GET_MARKET_PRICE = gql`
  query GetTokenMarketData($tokenName: String!) @api(contextKey: "apiName") {
    getTokenMarketData(tokenName: $tokenName) {
      current_price
    }
  }
`;

export { GET_MARKET_PRICE };
