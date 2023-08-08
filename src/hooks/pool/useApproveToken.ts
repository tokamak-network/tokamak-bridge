import { useErc20Allowance } from "@/generated";
import { useInOutTokens } from "../token/useInOutTokens";
import useContract from "../contracts/useContract";
import { useAccount } from "wagmi";
import { Hash } from "viem";
import { useMemo } from "react";
import { isETH } from "@/utils/token/isETH";
import { TokenInfo } from "@/types/token/supportedToken";

export function useAllowance(params: {
  tokenAddress: Hash | undefined;
  contractAddress: Hash | undefined;
  inputTokenAmount: BigInt | undefined | null;
  token: TokenInfo | null;
}) {
  const {
    tokenAddress,
    contractAddress,
    inputTokenAmount: inputTokenParam,
    token,
  } = params;
  const { address } = useAccount();
  const { data: allowance } = useErc20Allowance({
    address: tokenAddress,
    args: address && contractAddress ? [address, contractAddress] : undefined,
    watch: true,
  });
  const inputTokenAmount = inputTokenParam ?? 0;

  const isApproved = useMemo(() => {
    if (allowance !== undefined && inputTokenAmount !== undefined) {
      if (isETH(token)) {
        return true;
      }
      if (Number(allowance) === 0) {
        return false;
      }
      if ((allowance as BigInt) >= inputTokenAmount) {
        return true;
      }
      return false;
    }
    return false;
  }, [allowance, token]);

  return { isApproved };
}

export function useApproveToken() {
  const { inToken, outToken } = useInOutTokens();
  const { UNISWAP_CONTRACT } = useContract();

  const contractAddress = UNISWAP_CONTRACT.NONFUNGIBLE_POSITION_MANAGER;

  const inTokenApproved = useAllowance({
    tokenAddress: inToken?.tokenAddress as Hash | undefined,
    contractAddress,
    inputTokenAmount: inToken?.amountBN,
    token: inToken,
  });

  const outTokenApproved = useAllowance({
    tokenAddress: outToken?.tokenAddress as Hash | undefined,
    contractAddress,
    inputTokenAmount: outToken?.amountBN,
    token: outToken,
  });

  return {
    inTokenApproved: inTokenApproved.isApproved,
    outTokenApproved: outTokenApproved.isApproved,
  };
}
