import { useErc20Allowance } from "@/generated";
import { useInOutTokens } from "./useInOutTokens";
import useContract from "../contracts/useContract";
import { useAccount } from "wagmi";
import { Hash } from "viem";
import { useMemo } from "react";
import { isETH } from "@/utils/token/isETH";
import { TokenInfo } from "@/types/token/supportedToken";
import { useIncreaseAmount } from "../pool/useIncreaseAmount";
import { useV3MintInfo } from "../pool/useV3MintInfo";
import { ethers } from "ethers";
import { useGetMode } from "../mode/useGetMode";

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
  }, [allowance, token, inputTokenAmount]);

  return { isApproved, allowance };
}

export function useApproveToeken({
  contractAddress,
}: {
  contractAddress: Hash;
}) {
  const { inToken } = useInOutTokens();
  const inputTokenAmount =
    inToken?.amountBN &&
    ethers.utils.parseUnits(inToken?.amountBN.toString()).toBigInt();

  const tokenApproved = useAllowance({
    tokenAddress: inToken?.tokenAddress as Hash | undefined,
    contractAddress,
    inputTokenAmount,
    token: inToken,
  });

  return { tokenApproved };
}

export function useApproveTokenForPools() {
  const { inToken, outToken } = useInOutTokens();
  const { UNISWAP_CONTRACT } = useContract();
  const { invertPrice } = useV3MintInfo();
  const { token0Input, token1Input } = useIncreaseAmount();
  const { subMode } = useGetMode();

  const contractAddress = UNISWAP_CONTRACT?.NONFUNGIBLE_POSITION_MANAGER;

  const inTokenAmount = invertPrice
    ? token1Input &&
      ethers.utils.parseUnits(token1Input.toString(), 0).toBigInt()
    : token0Input &&
      ethers.utils.parseUnits(token0Input.toString(), 0).toBigInt();

  const outTokenAmount = invertPrice
    ? token0Input &&
      ethers.utils.parseUnits(token0Input.toString(), 0).toBigInt()
    : token1Input &&
      ethers.utils.parseUnits(token1Input.toString(), 0).toBigInt();

  const inTokenApproved = useAllowance({
    tokenAddress: inToken?.tokenAddress as Hash | undefined,
    contractAddress,
    inputTokenAmount: subMode.add
      ? inTokenAmount === 0
        ? undefined
        : inTokenAmount
      : inToken?.amountBN,
    token: inToken,
  });

  const outTokenApproved = useAllowance({
    tokenAddress: outToken?.tokenAddress as Hash | undefined,
    contractAddress,
    inputTokenAmount: subMode.add
      ? outTokenAmount === 0
        ? undefined
        : outTokenAmount
      : outToken?.amountBN,
    token: outToken,
  });

  return {
    inTokenApproved: inTokenApproved.isApproved,
    outTokenApproved: outTokenApproved.isApproved,
  };
}
