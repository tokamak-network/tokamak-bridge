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
  }, [inToken?.parsedAmount, tokenData?.data.parsedBalanceWithoutCommafied]);

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
  }, [
    outToken?.parsedAmount,
    outTokenData?.data.parsedBalanceWithoutCommafied,
  ]);

  const isInputZero = useMemo(() => {
    if (inToken?.parsedAmount) {
      return Number(inToken?.parsedAmount) === 0;
    }
    if (inToken?.parsedAmount === undefined || inToken?.parsedAmount === null)
      return true;
    return false;
  }, [inToken?.parsedAmount]);

  const isOutInputZero = useMemo(() => {
    if (outToken?.parsedAmount) {
      return Number(outToken?.parsedAmount) === 0;
    }
    if (outToken?.parsedAmount === undefined || outToken?.parsedAmount === null)
      return true;
    return false;
  }, [outToken?.parsedAmount]);

  return {
    isBalanceOver,
    isOutTokenBalanceOver,
    isInputZero,
    isOutInputZero,
    tokenData,
    outTokenData,
  };
}
