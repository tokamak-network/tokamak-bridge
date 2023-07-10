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
  query pools($token0: String!, $token1: String!, $feeTier: String!) {
   asToken0: pools(where: {token0: $token0 token1: $token1 feeTier: $feeTier}){
      id
      feeTier
      tick
      liquidity
      token0Price
      token1Price
      token0 {
        id
        symbol
        decimals
      }
      token1 {
        id
        symbol
        decimals
      }
  }  
  asToken1: pools(where: {token0: $token1 token1: $token0 feeTier: $feeTier}){
      id
      feeTier
      tick
      liquidity
      token0Price
      token1Price
      token0 {
        id
        symbol
        decimals
      }
      token1 {
        id
        symbol
        decimals
    }
  }  
}
`;
