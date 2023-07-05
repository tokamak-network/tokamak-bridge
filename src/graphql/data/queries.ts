import { gql } from "@apollo/client";

export const GET_POSITIONS = gql`
  query Positions($account: String!) {
   positions(where: {owner: $account}){
    id
    pool {
      id
      feeTier
      tick
      liquidity
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
    }
    owner
  }  
}
`;

export const GET_POOLS = gql`
  query pools($token0: String!, $token1: String!) {
   asToken0: pools(where: {token0: $token0 token1: $token1}){
    id
      id
      feeTier
      tick
      liquidity
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
  }  
  asToken1: pools(where: {token0: $token1 token1: $token0}){
    id
      id
      feeTier
      tick
      liquidity
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
`;
