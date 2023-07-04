import { gql } from "@apollo/client";

export const GET_POSITIONS = gql`
  query Positions {
   positions {
    id
    pool {
      id
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
    }
  }
  }
`;
