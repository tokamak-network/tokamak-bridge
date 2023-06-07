import { ethers } from "ethers";
import { CurrentConfig } from "../config";
import { computePoolAddress } from "@uniswap/v3-sdk";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { toReadableAmount, fromReadableAmount } from "../libs/converstion";
import {
  L1_UniswapContracts,
  L2_UniswapContracts,
} from "../../../constant/contracts/uniswap";
import { getL1Provider } from "@/config/l1Provider";
import { getL2Provider } from "@/config/l2Provider";

// const { POOL_FACTORY_CONTRACT_ADDRESS, QUOTER_CONTRACT_ADDRESS } =
//   L1_UniswapContracts;
const { POOL_FACTORY_CONTRACT_ADDRESS, QUOTER_CONTRACT_ADDRESS } =
  L2_UniswapContracts;

// const provider = getL1Provider();
const provider = getL2Provider();

export async function quote(): Promise<string> {
  const quoterContract = new ethers.Contract(
    QUOTER_CONTRACT_ADDRESS,
    Quoter.abi,
    provider
  );

  const poolConstants = await getPoolConstants();

  console.log(
    "poolConstants : ",
    poolConstants.token0,
    poolConstants.token1,
    poolConstants.fee
  );

  const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
    poolConstants.token0,
    poolConstants.token1,
    poolConstants.fee,
    fromReadableAmount(
      CurrentConfig.tokens.amountIn,
      CurrentConfig.tokens.in.decimals
    ).toString(),
    0
  );

  const quotedAmountOut2 =
    await quoterContract.callStatic.quoteExactInputSingle(
      poolConstants.token1,
      poolConstants.token0,
      poolConstants.fee,
      fromReadableAmount(
        CurrentConfig.tokens.amountIn,
        CurrentConfig.tokens.in.decimals
      ).toString(),
      0
    );

  console.log("quotedAmountOut : ", quotedAmountOut.toString());
  console.log("quotedAmountOut2 : ", quotedAmountOut2.toString());

  return toReadableAmount(quotedAmountOut, CurrentConfig.tokens.out.decimals);
}

async function getPoolConstants(): Promise<{
  token0: string;
  token1: string;
  fee: number;
}> {
  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: CurrentConfig.tokens.out,
    tokenB: CurrentConfig.tokens.in,
    fee: CurrentConfig.tokens.poolFee,
    initCodeHashManualOverride:
      "0xa598dd2fba360510c5a8f02f44423a4468e902df5857dbce3ca162a43a3a31ff",
  });

  console.log("currentPoolAddress : ", currentPoolAddress);

  const poolContract = new ethers.Contract(
    currentPoolAddress,
    IUniswapV3PoolABI.abi,
    provider
  );

  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
  ]);

  return {
    token0,
    token1,
    fee,
  };
}
