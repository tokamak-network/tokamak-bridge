import { useMemo } from "react";
import { useInOutTokens } from "./useInOutTokens";
import useTokenBalance from "../contracts/balance/useTokenBalance";

export default function useInputBalanceCheck() {
  const { inToken, outToken } = useInOutTokens();
  const tokenData = useTokenBalance(inToken);
  const outTokenData = useTokenBalance(outToken);

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
  }, [inToken?.amountBN, tokenData?.data.parsedBalanceWithoutCommafied]);

  const isOutTokenBalanceOver = useMemo(() => {
    if (
      outToken?.parsedAmount &&
      outTokenData?.data.parsedBalanceWithoutCommafied
    ) {
      return (
        Number(outToken?.parsedAmount) >
        Number(outTokenData?.data.parsedBalanceWithoutCommafied)
      );
    }
    return false;
  }, [outToken?.amountBN, outTokenData?.data.parsedBalanceWithoutCommafied]);

  const isInputZero = useMemo(() => {
    if (
      inToken?.parsedAmount &&
      tokenData?.data.parsedBalanceWithoutCommafied
    ) {
      return Number(inToken?.parsedAmount) === 0;
    }
    return false;
  }, [inToken?.amountBN, tokenData?.data.parsedBalanceWithoutCommafied]);

  return { isBalanceOver, isOutTokenBalanceOver, isInputZero };
}
