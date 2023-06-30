import { useMemo } from "react";
import { useInOutTokens } from "./useInOutTokens";
import useTokenBalance from "../contracts/balance/useTokenBalance";

export default function useInputBalanceCheck() {
  const { inToken } = useInOutTokens();
  const tokenData = useTokenBalance(inToken);

  const isBalanceOver = useMemo(() => {
    if (
      inToken?.parsedAmount &&
      tokenData?.data.parsedBalanceWithoutCommafied
    ) {
      return (
        Number(inToken?.parsedAmount) >
        Number(tokenData?.data.parsedBalanceWithoutCommafied)
      );
    }
    return false;
  }, [inToken?.amountBN, tokenData?.data.balanceBN]);

  const isInputZero = useMemo(() => {
    if (
      inToken?.parsedAmount &&
      tokenData?.data.parsedBalanceWithoutCommafied
    ) {
      return Number(inToken?.parsedAmount) === 0;
    }
    return false;
  }, [inToken?.amountBN, tokenData?.data.balanceBN]);

  return { isBalanceOver, isInputZero };
}
