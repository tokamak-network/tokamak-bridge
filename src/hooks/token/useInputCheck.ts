import { useMemo } from "react";
import { useInOutTokens } from "./useInOutTokens";
import useTokenBalance from "../contracts/balance/useTokenBalance";

export default function useInputBalanceCheck() {
  const { inToken } = useInOutTokens();
  const tokenData = useTokenBalance(inToken);
  const isBalanceOver = useMemo(() => {
    if (tokenData?.data.parsedBalanceWithoutCommafied) {
      return Number(tokenData?.data.parsedBalanceWithoutCommafied);
    }
  }, [inToken?.amountBN, tokenData?.data.balanceBN]);

  return { isBalanceOver };
}
