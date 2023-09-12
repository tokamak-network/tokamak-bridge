import { gql } from "@apollo/client";

export const GET_POSITIONS = gql`
  query Positions($account: String!) {
   positions(where: {owner: $account}){
    id
    owner
    liquidity
    feeGrowthInside0LastX128
    feeGrowthInside1LastX128
    tickLower {
        tickIdx
        feeGrowthOutside0X128
        feeGrowthOutside1X128
      }
    tickUpper {
        tickIdx
        feeGrowthOutside0X128
        feeGrowthOutside1X128
    }
    pool {
      id
      feeTier
      sqrtPrice
      tick
      liquidity
      feeGrowthGlobal0X128
      feeGrowthGlobal1X128
      token0 {
        id
        symbol
        name
        decimals
      }
      token1 {
        id
        symbol
        name
        decimals
      }
    }
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
