import { gql } from "@apollo/client";

export const GET_POSITIONS = gql`
  query Positions($account: String!) @api(contextKey: "apiName") {
    positions(owner: $account) {
      id
    }
  }
`;
