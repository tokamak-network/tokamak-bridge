import { Contract } from "@ethersproject/contracts";
import { ethers } from "ethers";

const encodePath = (path: any, fees: any) => {
  const FEE_SIZE = 3;
  if (path.length != fees.length + 1) {
    throw new Error("path/fee lengths do not match");
  }
  let encoded = "0x";
  for (let i = 0; i < fees.length; i++) {
    encoded += path[i].slice(2);
    encoded += fees[i].toString(16).padStart(2 * FEE_SIZE, "0");
  }
  encoded += path[path.length - 1].slice(2);
  return encoded.toLowerCase();
};

//encode path when out token is ETH
//to unwrap when it's out
export function getEncodedPath(params: {
  route: any;
  swapRouterAddress: string;
  SwapRouterContract: Contract;
  slippage: number;
  deadlineMin: number;
}) {
  const {
    route,
    swapRouterAddress,
    SwapRouterContract,
    deadlineMin,
    slippage,
  } = params;
  let deadline = Math.floor(Date.now() / 1000) + deadlineMin * 60;
  let routePath;
  let paths = [];
  let fees = [];
  let swapData = [];

  for (let i = 0; i < route.length; i++) {
    routePath = route[i];
    let amountIn = ethers.BigNumber.from(routePath[0]["amountIn"]);
    paths[i] = [
      routePath[0]["tokenIn"]["address"],
      routePath[0]["tokenOut"]["address"],
    ];
    fees[i] = [parseInt(routePath[0]["fee"])];
    if (routePath.length > 1) {
      for (let j = 1; j < routePath.length; j++) {
        paths[i].push(routePath[j]["tokenOut"]["address"]);
        fees[i].push(parseInt(routePath[j]["fee"]));
      }
      let amountOutMinimum = ethers.BigNumber.from(
        Math.floor(
          routePath[routePath.length - 1]["amountOut"] / (1 + slippage),
        ).toString(),
      );

      let path = encodePath(paths[i], fees[i]);
      const params = {
        recipient: swapRouterAddress,
        path,
        amountIn,
        amountOutMinimum,
        // deadline,
      };
      swapData.push(
        SwapRouterContract.interface.encodeFunctionData("exactInput", [params]),
      );
    } else {
      //해당 로직 추가 (임시)
      const amountOutBigInt = BigInt(routePath[0]["amountOut"]);
      const scaleFactor = BigInt(1e18);
      const slippageBigInt = BigInt(Math.floor(slippage * 1e18));
      const denominator = scaleFactor + slippageBigInt;
      const scaledAmountOut = (amountOutBigInt * scaleFactor) / denominator;
      //입력단에서 제한해야 할듯.
      ////

      let amountOutMinimum = ethers.BigNumber.from(
        //복원시 위 임시 지우고 아래 주석 풀고 그 아래 지우기
        //Math.floor(routePath[0]["amountOut"] / (1 + slippage)).toString()
        scaledAmountOut.toString(),
      );
      let SwapParams = {
        tokenIn: routePath[0]["tokenIn"]["address"],
        tokenOut: routePath[0]["tokenOut"]["address"],
        fee: 3000,
        recipient: swapRouterAddress,
        //deadline: deadline,
        amountIn: amountIn,
        amountOutMinimum,
        sqrtPriceLimitX96: 0,
      };
      swapData.push(
        SwapRouterContract.interface.encodeFunctionData("exactInputSingle", [
          SwapParams,
        ]),
      );
    }
  }
  const amountMinimum = 0;
  const encData2 = SwapRouterContract.interface.encodeFunctionData(
    "unwrapWETH9(uint256)",
    [amountMinimum],
  );
  swapData.push(encData2);
  const encMultiCall = SwapRouterContract.interface.encodeFunctionData(
    "multicall(uint256,bytes[])",
    [deadline, swapData],
  );

  return encMultiCall;
}
