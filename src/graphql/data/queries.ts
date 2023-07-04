import { gql } from "@apollo/client";

export const GET_POSITIONS = gql`
  query Positions {
    positions {
      id
    }
  }
`;
