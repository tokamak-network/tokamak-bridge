import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import {
  useErc20Approve,
  useErc20TotalSupply,
  usePrepareErc20Approve,
} from "@/generated";
import { useContractWrite, useWaitForTransaction } from "wagmi";

import { useMemo } from "react";
import { useGetMode } from "../mode/useGetMode";
import useContract from "@/hooks/contracts/useContract";
import useConnectedNetwork from "../network";
import { useTx } from "../tx/useTx";
import { USDT_ADDRESS_BY_CHAINID } from "@/constant/contracts/tokens";
import { useAllowance } from "./useApproveToken";
import { Hash } from "viem";
import { useUniswapContracts } from "../uniswap/useUniswapContracts";
import USDT_ABI from "@/constant/abis/USDT.json";

export function useApprove() {
  const { mode } = useGetMode();
  const { inToken } = useInOutTokens();
  const tokenAddress = inToken?.token.address as Hash | undefined;

  const { L1BRIDGE_CONTRACT, SWAPPER_V2_CONTRACT } = useContract();
  const { UNISWAP_CONTRACT } = useUniswapContracts();
  const { connectedChainId } = useConnectedNetwork();

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

  const { isApproved: approved, allowance } = useAllowance({
    inputTokenAmount: inToken?.amountBN,
    tokenAddress,
    token: inToken,
    contractAddress:
      mode === "Deposit"
        ? (L1BRIDGE_CONTRACT as Hash)
        : mode === "Swap"
        ? (UNISWAP_CONTRACT?.SWAP_ROUTER_ADDRESS2 as Hash)
        : mode === "Wrap" || mode === "Unwrap"
        ? (SWAPPER_V2_CONTRACT as Hash)
        : undefined,
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

  const isUSDT = connectedChainId
    ? tokenAddress === USDT_ADDRESS_BY_CHAINID[connectedChainId]
    : undefined;

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

  const { write: USDT_APPROVE } = useContractWrite({
    address: tokenAddress,
    abi: USDT_ABI,
    functionName: "approve",
  });

  const { isLoading } = useTx({
    hash: data?.hash,
    txSort: "Approve",
    tokenAddress,
    actionSort: mode,
  });

  return {
    isApproved,
    callApprove: () =>
      isUSDT
        ? USDT_APPROVE({
            args: [contractAddress, totalSupply?.toString()],
          })
        : write?.(),
    isLoading,
    hash: data?.hash,
  };
}
