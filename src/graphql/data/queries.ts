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

export const GET_POOL = gql`
  query pools($token0: String!, $token1: String!) {
   asToken0: positions(where: {token0: $token0 token1: $token1}){
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
  asToken1: positions(where: {token0: $token1 token1: $token0}){
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
