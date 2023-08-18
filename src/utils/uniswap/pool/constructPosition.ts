// import { CurrencyAmount, Token } from "@uniswap/sdk-core";
// import { Position, nearestUsableTick } from "@uniswap/v3-sdk";

// export async function  constructPosition  (
//     token0Amount: CurrencyAmount<Token>,
//     token1Amount: CurrencyAmount<Token>
//   ): Promise<Position | undefined>  {
//     // get pool info
//     const poolInfo = await getPoolInfo();

//     console.log("poolInfo : ", poolInfo);

//     if (poolInfo) {
//       // construct pool instance
//       const configuredPool = new Pool(
//         token0Amount.currency,
//         token1Amount.currency,
//         poolInfo.fee,
//         poolInfo.sqrtPriceX96.toString(),
//         poolInfo.liquidity.toString(),
//         poolInfo.tick
//       );

//       // create position using the maximum liquidity from input amounts
//       return Position.fromAmounts({
//         pool: configuredPool,
//         tickLower:
//           nearestUsableTick(poolInfo.tick, poolInfo.tickSpacing) -
//           poolInfo.tickSpacing * 2,
//         tickUpper:
//           nearestUsableTick(poolInfo.tick, poolInfo.tickSpacing) +
//           poolInfo.tickSpacing * 2,
//         amount0: token0Amount.quotient,
//         amount1: token1Amount.quotient,
//         useFullPrecision: true,
//       });
//     }
//     return undefined;
//   },
//   []
// );
