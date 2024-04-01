import { useEffect, useMemo, useState } from "react";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useUniswapContracts } from "../uniswap/useUniswapContracts";
import { FeeAmount } from "@uniswap/v3-sdk";
import {
  fromReadableAmount,
  toReadableAmount,
} from "@/utils/uniswap/libs/converstion";
import { ethers } from "ethers";
import { useAmountOut } from "./useSwapTokens";
import JSBI from "jsbi";
import commafy from "@/utils/trim/commafy";
import { useGetMode } from "@/hooks/mode/useGetMode";
import useIsLoading from "../ui/useIsLoading";
import { useSmartRouter } from "../uniswap/useSmartRouter";

const sqrtToPrice = (
  sqrt: number,
  decimals0: number,
  decimals1: number,
  token0IsInput?: boolean
) => {
  const numerator = sqrt ** 2;
  const denominator = 2 ** 192;
  let ratio = numerator / denominator;
  const shiftDecimals = Math.pow(10, decimals0 - decimals1);
  ratio = ratio * shiftDecimals;
  if (token0IsInput === false) {
    ratio = 1 / ratio;
  }
  return ratio;
};

const getSqrt = async (
  QUOTER_CONTRACT: any,
  inTokenAddress: string,
  outTokenAddress: string,
  inTokenAmountBN: any
) => {
  const quote = await QUOTER_CONTRACT.callStatic.quoteExactInputSingle(
    inTokenAddress,
    outTokenAddress,
    FeeAmount.MEDIUM,
    inTokenAmountBN,
    0
  );

  return quote.toString();
};

export default function usePriceImpact() {
  const [markPrice, setMarkPrice] = useState<number | undefined>(undefined);

  const { inToken, outToken } = useInOutTokens();
  const { mode } = useGetMode();
  const [, setIsLoading] = useIsLoading();

  const { routingPath } = useSmartRouter();

  const outPrice = useMemo(() => {
    if (routingPath) {
      const { amountDecimals, quoteDecimals } = routingPath;
      return Number(quoteDecimals) / Number(amountDecimals);
    }
  }, [routingPath]);

  // const priceImpact = useMemo(() => {
  //   if (routingPath) {
  //     const { route } = routingPath;
  //     const test = route.map((path: any) => {
  //       path.map((pathData: any) => {
  //         const { sqrtRatioX96, tokenIn, tokenOut } = pathData;
  //         const test = sqrtToPrice(
  //           Number(sqrtRatioX96),
  //           Number(tokenIn.decimals),
  //           Number(tokenOut.decimals)
  //         );
  //         console.log(test, sqrtRatioX96);
  //         return { test, sqrtRatioX96 };
  //       });
  //     });

  //     return test;
  //   }
  // }, [routingPath]);

  // useEffect(() => {
  //   async function test() {
  //     const result = await getSqrt(
  //       QUOTER_CONTRACT,
  //       "0x67F3bE272b1913602B191B3A68F7C238A2D81Bb9",
  //       "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  //       "11000000000000000000"
  //     );
  //     console.log("--test");

  //     console.log(result);
  //   }
  //   test();
  // }, [QUOTER_CONTRACT]);

  // console.log(priceImpact);

  // const priceImpact = useMemo(() => {
  //   if (markPrice && amountOut && inToken && inToken.parsedAmount !== null) {
  //     try {
  //       setIsLoading(true);
  //       // const amountInBI = JSBI.BigInt(
  //       //   ethers.utils.parseUnits(inToken.parsedAmount.replaceAll(",", ""), 18)
  //       // );

  //       // const amountOutBI = JSBI.BigInt(
  //       //   ethers.utils.parseUnits(amountOut.toString(), 18)
  //       // );
  //       const nowPrice =
  //         Number(amountOut.toString()) /
  //         Number(inToken.parsedAmount.toString());
  //       // // const remainder = JSBI.remainder(amountOutBI, amountInBI);

  //       setOutPrice(commafy(nowPrice, 4));

  //       const priceImpact =
  //         (Number(nowPrice.toString().slice(0, 10)) / markPrice) * 100 - 100;
  //       return commafy(priceImpact, 2);
  //     } catch (e) {
  //       console.log("**priceImpact err**");
  //       console.log(e);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   return undefined;
  // }, [markPrice, amountOut, inToken]);

  return { priceImpact: undefined, outPrice };
}
