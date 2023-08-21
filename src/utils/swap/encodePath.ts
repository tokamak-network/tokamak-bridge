import { Contract } from "@ethersproject/contracts";

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
}) {
  const { route, swapRouterAddress, SwapRouterContract } = params;
  let deadline = Math.floor(Date.now() / 1000) + 100000;
  let routePath;
  let paths = [];
  let fees = [];
  let amountIns = [];
  let swapData = [];

  for (let i = 0; i < route.length; i++) {
    routePath = route[i];
    amountIns[i] = routePath[0]["amountIn"];
    let amountIn = amountIns[i];
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
      let amountOutMinimum = Math.floor(
        routePath[routePath.length - 1]["amountOut"] * 0.995
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
        SwapRouterContract.interface.encodeFunctionData("exactInput", [params])
      );
    } else {
      let amountOutMinimum = Math.floor(routePath[0]["amountOut"] * 0.995);
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
        ])
      );
    }
  }
  const amountMinimum = 0;
  const encData2 = SwapRouterContract.interface.encodeFunctionData(
    "unwrapWETH9(uint256)",
    [amountMinimum]
  );
  swapData.push(encData2);
  const encMultiCall = SwapRouterContract.interface.encodeFunctionData(
    "multicall(uint256,bytes[])",
    [deadline, swapData]
  );

  return encMultiCall;
}
