export type PoolData = [
  {
    id: string;
    feeTier: string;
    tick: string;
    liquidity: string;
    token0Price: string;
    token1Price: string;
    token0: {
      id: string;
      symbol: string;
      decimals: string;
    };
    token1: {
      id: string;
      symbol: string;
      decimals: string;
    };
  }
];

export type PoolData_Subgraph =
  | { asToken0: PoolData | []; asToken1: PoolData | [] }
  | undefined;
