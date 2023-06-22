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

export default function usePriceImpact() {
  const [markPrice, setMarkPrice] = useState<number | undefined>(undefined);
  const [outPrice, setOutPrice] = useState<string | undefined>(undefined);

  const { inToken, outToken } = useInOutTokens();
  const { QUOTER_CONTRACT } = useUniswapContracts();
  const { amountOut } = useAmountOut();
  const { mode } = useGetMode();
  const [, setIsLoading] = useIsLoading();

  useEffect(() => {
    const fetchMarkPrice = async () => {
      if (mode === "Swap" && inToken && outToken !== null) {
        const quotedAmountOut =
          await QUOTER_CONTRACT.callStatic.quoteExactInputSingle(
            inToken.token.address,
            outToken.token.address,
            FeeAmount.MEDIUM,
            ethers.utils.parseUnits("1", inToken.decimals),
            0
          );

        const readableAmount = ethers.utils.formatUnits(
          quotedAmountOut,
          outToken.decimals
        );

        return setMarkPrice(Number(readableAmount.toString().slice(0, 10)));
      }
      return setMarkPrice(undefined);
    };
    fetchMarkPrice().catch((e) => {
      console.log("**fetchMarkPrice err**");
      console.log(e);
      return setMarkPrice(undefined);
    });
  }, [inToken, outToken, QUOTER_CONTRACT, mode]);

  const priceImpact = useMemo(() => {
    if (markPrice && amountOut && inToken && inToken.parsedAmount !== null) {
      try {
        setIsLoading(true);
        // const amountInBI = JSBI.BigInt(
        //   ethers.utils.parseUnits(inToken.parsedAmount.replaceAll(",", ""), 18)
        // );

        // const amountOutBI = JSBI.BigInt(
        //   ethers.utils.parseUnits(amountOut.toString(), 18)
        // );
        const nowPrice =
          Number(amountOut.toString()) /
          Number(inToken.parsedAmount.toString());
        // // const remainder = JSBI.remainder(amountOutBI, amountInBI);

        setOutPrice(commafy(nowPrice, 4));

        const priceImpact =
          (Number(nowPrice.toString().slice(0, 4)) / markPrice) * 100 - 100;
        return commafy(priceImpact, 2);
      } catch (e) {
        console.log("**priceImpact err**");
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    }
    return undefined;
  }, [markPrice, amountOut, inToken]);

  return { priceImpact, outPrice };
}
