import L2TitanBridgeAbi from "@/abis/L2StandardBridge.json";
import L2ThanosBridgeAbi from "@/abis/L2ThanosStandardBridge.json";
import L2ThanosUSDCBridgeAbi from "@/abis/L2USDCBridge.json";
import { useContractWrite, usePublicClient } from "wagmi";
import { Hash, getContract } from "viem";
import useContract from "@/hooks/contracts/useContract";

import { useTx } from "@/hooks/tx/useTx";
import { useInOutNetwork } from "@/hooks/network";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import {
  SupportedChainId,
  SupportedL2ChainId,
} from "@/types/network/supportedNetwork";
import { isThanosChain } from "@/utils/network/checkNetwork";

export default function useCallWithdraw(functionName: string) {
  const { inNetwork } = useInOutNetwork();
  const { inToken } = useInOutTokens();
  const { L2BRIDGE_CONTRACT } = useContract();
  const abi =
    inNetwork?.chainId !== SupportedChainId.THANOS_SEPOLIA
      ? L2TitanBridgeAbi
      : L2ThanosBridgeAbi;

  const { data, write, isError } =
    inToken?.tokenSymbol === "USDC"
      ? useContractWrite({
          address: L2BRIDGE_CONTRACT as Hash,
          abi: L2ThanosUSDCBridgeAbi,
          functionName,
        })
      : isThanosChain(inNetwork?.chainId)
      ? useContractWrite({
          address: L2BRIDGE_CONTRACT as Hash,
          abi: L2ThanosBridgeAbi,
          functionName,
        })
      : useContractWrite({
          address: L2BRIDGE_CONTRACT as Hash,
          abi: L2TitanBridgeAbi,
          functionName,
        });

  const {} = useTx({
    hash: data?.hash,
    txSort: "Withdraw",
    L2Chain: inNetwork?.chainId ?? SupportedChainId.THANOS_SEPOLIA,
    inToken: inToken?.tokenSymbol,
  });

  const provider = usePublicClient();
  const contract =
    inToken?.tokenSymbol === "USDC"
      ? getContract({
          address: L2BRIDGE_CONTRACT as Hash,
          abi: L2ThanosUSDCBridgeAbi,
          publicClient: provider,
        })
      : isThanosChain(inNetwork?.chainId)
      ? getContract({
          address: L2BRIDGE_CONTRACT as Hash,
          abi: L2ThanosBridgeAbi,
          publicClient: provider,
        })
      : getContract({
          address: L2BRIDGE_CONTRACT as Hash,
          abi: L2TitanBridgeAbi,
          publicClient: provider,
        });

  return { write, contract, isError };
}
