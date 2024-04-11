import { useRecoilValue } from "recoil";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useProvier } from "@/hooks/provider/useProvider";
import { ethers, Contract } from "ethers";
import ERC20_ABI from "@/constant/abis/erc20.json";
import USDT_ABI from "@/constant/abis/USDT.json";

import { useContractRead, useContractWrite } from "wagmi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetMode } from "../mode/useGetMode";
import useContract from "@/hooks/contracts/useContract";
import useConnectedNetwork from "../network";
import { useTx } from "../tx/useTx";
import {
  GOERLI_CONTRACTS,
  MAINNET_CONTRACTS,
  TOKAMAK_CONTRACTS,
  TOKAMAK_GOERLI_CONTRACTS,
} from "@/constant/contracts";
import { USDT_ADDRESS_BY_CHAINID } from "@/constant/contracts/tokens";
import { useAllowance } from "./useApproveToken";
import { Hash } from "viem";
import { useUniswapContracts } from "../uniswap/useUniswapContracts";

export function useApprove() {
  const { mode } = useGetMode();
  const { inToken } = useInOutTokens();

  const { L1BRIDGE_CONTRACT, L2BRIDGE_CONTRACT, SWAPPER_V2_CONTRACT } =
    useContract();
  const { UNISWAP_CONTRACT } = useUniswapContracts();
  const { connectedChainId } = useConnectedNetwork();

  const { isApproved: approved } = useAllowance({
    inputTokenAmount: inToken?.amountBN,
    tokenAddress: inToken?.token.address as Hash | undefined,
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
    ? inToken?.tokenAddress === USDT_ADDRESS_BY_CHAINID[connectedChainId]
    : undefined;

  const { write, data, isLoading } = useContractWrite({
    address: inToken?.tokenAddress as `0x${string}`,
    //@ts-ignore
    abi: isUSDT ? USDT_ABI : ERC20_ABI.abi,
    functionName: "approve",
  });
  const { data: totalSupply } = useContractRead({
    address: inToken?.tokenAddress as `0x${string}`,
    abi: ERC20_ABI.abi,
    functionName: "totalSupply",
  });

  const tx = useTx({
    hash: data?.hash,
    txSort: "Approve",
    tokenAddress: inToken?.tokenAddress as `0x${string}`,
  });

  const callApprove = useCallback(async () => {
    try {
      if (totalSupply) {
        switch (mode) {
          case "Deposit":
            return write({
              args: [L1BRIDGE_CONTRACT, totalSupply],
            });
          case "Withdraw":
            return write({
              args: [L2BRIDGE_CONTRACT, totalSupply],
            });
          case "Swap":
            return write({
              args: [UNISWAP_CONTRACT?.SWAP_ROUTER_ADDRESS2, totalSupply],
            });
          case "Wrap":
          case "Unwrap":
            return write({
              args: [SWAPPER_V2_CONTRACT, totalSupply],
            });
          default:
            break;
        }
      }
    } catch (e) {
      console.log("**callApprove err*");
      console.log(e);
    }
  }, [mode, totalSupply, connectedChainId]);

  return { isApproved, callApprove, isLoading };
}
