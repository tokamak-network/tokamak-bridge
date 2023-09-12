import { TickLibrary, PositionLibrary } from "@uniswap/v3-sdk";
import { Contract, ethers } from "ethers";
import JSBI from "jsbi";

export async function calculateFeeToCollect(params: {
  position: any;
  NonfungiblePositionManagerContract: Contract;
}) {
  const { position, NonfungiblePositionManagerContract } = params;
  const tokenId = position.id;
  const slot0TickSub = parseInt(position.pool.tick);
  const tickLowerSub = parseInt(position.tickLower.tickIdx);
  const tickUpperSub = parseInt(position.tickUpper.tickIdx);
  const liquiditySub = JSBI.BigInt(position.liquidity);

  const feeGrowthOutside0Lower = JSBI.BigInt(
    position.tickLower.feeGrowthOutside0X128
  );
  const feeGrowthOutside1Lower = JSBI.BigInt(
    position.tickLower.feeGrowthOutside1X128
  );
  const feeGrowthOutside0Upper = JSBI.BigInt(
    position.tickUpper.feeGrowthOutside0X128
  );
  const feeGrowthOutside1Upper = JSBI.BigInt(
    position.tickUpper.feeGrowthOutside1X128
  );
  const feeGrowthGlobal0X128 = JSBI.BigInt(position.pool.feeGrowthGlobal0X128);
  const feeGrowthGlobal1X128 = JSBI.BigInt(position.pool.feeGrowthGlobal1X128);

  const feeGrowthInside = TickLibrary.getFeeGrowthInside(
    {
      feeGrowthOutside0X128: feeGrowthOutside0Lower,
      feeGrowthOutside1X128: feeGrowthOutside1Lower,
    },
    {
      feeGrowthOutside0X128: feeGrowthOutside0Upper,
      feeGrowthOutside1X128: feeGrowthOutside1Upper,
    },
    tickLowerSub,
    tickUpperSub,
    slot0TickSub,
    feeGrowthGlobal0X128,
    feeGrowthGlobal1X128
  );
  const feeGrowthInside0X128 = feeGrowthInside[0];
  const feeGrowthInside1X128 = feeGrowthInside[1];
  const feeGrowthInside0LastX128 = JSBI.BigInt(
    position.feeGrowthInside0LastX128
  );
  const feeGrowthInside1LastX128 = JSBI.BigInt(
    position.feeGrowthInside1LastX128
  );

  const tokenOweds = PositionLibrary.getTokensOwed(
    feeGrowthInside0LastX128,
    feeGrowthInside1LastX128,
    liquiditySub,
    feeGrowthInside0X128,
    feeGrowthInside1X128
  );
  const tokenOwed0 = tokenOweds[0];
  const tokenOwed1 = tokenOweds[1];

  const positionInfo = await NonfungiblePositionManagerContract.positions(
    tokenId
  );
  const tokenOwed0Already = positionInfo.tokensOwed0;
  const tokenOwed1Already = positionInfo.tokensOwed1;

  const token0Fee = ethers.BigNumber.from(tokenOwed0.toString())
    .add(tokenOwed0Already)
    .toString();
  const token1Fee = ethers.BigNumber.from(tokenOwed1.toString())
    .add(tokenOwed1Already)
    .toString();

  return { token0Fee, token1Fee };
}
