import { useEffect, useMemo, useState } from "react";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useUniswapContracts } from "../uniswap/useUniswapContracts";
import { FeeAmount } from "@uniswap/v3-sdk";
import { fromReadableAmount } from "@/utils/uniswap/libs/converstion";
import { ethers } from "ethers";
import { useAmountOut } from "./useSwapTokens";
import JSBI from "jsbi";
import commafy from "@/utils/trim/commafy";

export default function usePriceImpact() {
  const [markPrice, setMarkPrice] = useState<bigint | undefined>(undefined);
  const [outPrice, setOutPrice] = useState<string | undefined>(undefined);

  const { inToken, outToken } = useInOutTokens();
  const { QUOTER_CONTRACT } = useUniswapContracts();
  const { amountOut } = useAmountOut();

  useEffect(() => {
    const fetchMarkPrice = async () => {
      if (inToken && outToken) {
        const quotedAmountOut =
          await QUOTER_CONTRACT.callStatic.quoteExactInputSingle(
            inToken.token.address,
            outToken.token.address,
            FeeAmount.MEDIUM,
            ethers.utils.parseUnits("1", inToken.decimals),
            0
          );
        return setMarkPrice(quotedAmountOut.toBigInt());
      }
      return setMarkPrice(undefined);
    };
    fetchMarkPrice().catch((e) => {
      console.log("**fetchMarkPrice err**");
      console.log(e);
      return setMarkPrice(undefined);
    });
  }, [inToken, outToken, QUOTER_CONTRACT]);

  const priceImpact = useMemo(() => {
    if (markPrice && amountOut && inToken?.parsedAmount && outToken) {
      const markPriceBI = JSBI.BigInt(markPrice.toString());
      const amountInBI = JSBI.BigInt(inToken?.parsedAmount);
      const amountOutBI = JSBI.BigInt(
        ethers.utils.parseUnits(amountOut.toString(), outToken?.decimals)
      );
      const nowPrice = JSBI.divide(amountOutBI, amountInBI);

      setOutPrice(
        commafy(
          ethers.utils.formatUnits(nowPrice.toString(), outToken.decimals),
          2
        )
      );

      const priceImpact =
        (Number(nowPrice.toString()) / Number(markPriceBI.toString())) * 100 -
        100;
      return commafy(priceImpact, 0);
    }
    return undefined;
  }, [markPrice, amountOut]);

  return { priceImpact, outPrice };
}
