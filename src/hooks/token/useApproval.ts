import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import {
  useErc20Approve,
  useErc20TotalSupply,
  usePrepareErc20Approve,
} from "@/generated";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { useCallback, useMemo } from "react";
import { useGetMode } from "../mode/useGetMode";
import useContract from "@/hooks/contracts/useContract";
import useConnectedNetwork from "../network";
import { useTx } from "../tx/useTx";
import { USDT_ADDRESS_BY_CHAINID } from "@/constant/contracts/tokens";
import { useAllowance } from "./useApproveToken";
import { Hash } from "viem";
import { useUniswapContracts } from "../uniswap/useUniswapContracts";
import USDT_ABI from "@/constant/abis/USDT.json";
import { is } from "date-fns/locale";
import { all } from "axios";

export function useApprove() {
  const { mode } = useGetMode();
  const { inToken } = useInOutTokens();
  const tokenAddress = inToken?.token.address as Hash | undefined;

  const { L1BRIDGE_CONTRACT, SWAPPER_V2_CONTRACT } = useContract();
  const { UNISWAP_CONTRACT } = useUniswapContracts();
  const { connectedChainId, isLayer2 } = useConnectedNetwork();

  const contractAddress = useMemo(() => {
    switch (mode) {
      case "Deposit":
        return L1BRIDGE_CONTRACT as Hash;
      case "Swap":
        return UNISWAP_CONTRACT?.SWAP_ROUTER_ADDRESS2 as Hash;
      case "Wrap":
      case "Unwrap":
        return SWAPPER_V2_CONTRACT as Hash;
      default:
        return undefined;
    }
  }, [mode, L1BRIDGE_CONTRACT, UNISWAP_CONTRACT, SWAPPER_V2_CONTRACT]);

  const { isApproved: approved, allowanceIsBiggerThanZero } = useAllowance({
    inputTokenAmount: inToken?.amountBN,
    tokenAddress,
    token: inToken,
    contractAddress,
  });

  const isApproved = useMemo(() => {
    switch (mode) {
      case "Deposit":
        return approved;
      case "Withdraw":
        return true;
      case "Swap":
        return approved;
      case "Wrap":
      case "Unwrap":
        return approved;
      case "ETH-Wrap":
      case "ETH-Unwrap":
        return true;
      default:
        return false;
    }
  }, [mode, approved]);

  const isUSDT = useMemo(() => {
    return connectedChainId
      ? tokenAddress === USDT_ADDRESS_BY_CHAINID[connectedChainId]
      : undefined;
  }, [connectedChainId, tokenAddress, USDT_ADDRESS_BY_CHAINID]);

  const { data: totalSupply } = useErc20TotalSupply({
    address: tokenAddress,
  });
  const { config, error, isError } = usePrepareErc20Approve({
    address: tokenAddress,
    args:
      contractAddress && totalSupply
        ? [contractAddress, totalSupply]
        : undefined,
    enabled: Boolean(contractAddress && totalSupply),
    chainId: connectedChainId,
  });

  const { data, write } = useErc20Approve(config);

  const { data: usdtApproveData, write: USDT_APPROVE } = useContractWrite({
    address: tokenAddress,
    abi: USDT_ABI,
    functionName: "approve",
  });
  const { data: usdtRevokeData, write: USDT_APPROVE_REVOKE } = useContractWrite(
    {
      address: tokenAddress,
      abi: USDT_ABI,
      functionName: "approve",
    }
  );

  const isRevokeForUSDT = useMemo(() => {
    if (isUSDT && allowanceIsBiggerThanZero && !isLayer2) {
      return true;
    }
    return false;
  }, [isUSDT, allowanceIsBiggerThanZero, isLayer2]);

  const approveForUSDT = useCallback(() => {
    if (isRevokeForUSDT) {
      return USDT_APPROVE_REVOKE({
        args: [contractAddress, 0],
      });
    }
    return USDT_APPROVE({
      args: [contractAddress, totalSupply?.toString()],
    });
  }, [
    contractAddress,
    totalSupply,
    USDT_APPROVE,
    USDT_APPROVE_REVOKE,
    isRevokeForUSDT,
  ]);

  const { isLoading } = useTx({
    hash: isUSDT ? usdtApproveData?.hash : data?.hash,
    txSort: "Approve",
    tokenAddress,
    actionSort: mode,
  });
  const { isLoading: usdtRevokeIsLoading } = useTx({
    hash: usdtRevokeData?.hash,
    txSort: "Revoke",
    tokenAddress,
    actionSort: mode,
  });

  const callApprove = useCallback(() => {
    isUSDT ? approveForUSDT() : write?.();
  }, [
    contractAddress,
    totalSupply,
    isUSDT,
    USDT_APPROVE,
    write,
    approveForUSDT,
  ]);

  return {
    isApproved,
    callApprove,
    isLoading: isLoading || usdtRevokeIsLoading,
    hash: data?.hash,
    isRevokeForUSDT,
  };
}
