import L1BridgeAbi from "@/abis/L1StandardBridge.json";
import { useContractWrite, usePublicClient } from "wagmi";
import { GOERLI_CONTRACTS } from "@/constant/contracts";
import { getContract } from "viem";
import { useTx } from "@/hooks/tx/useTx";

export default function useCallDeposit(functionName: string) {
  const { data, write, isLoading } = useContractWrite({
    address: GOERLI_CONTRACTS.L1Bridge,
    abi: L1BridgeAbi,
    functionName,
  });

  const provider = usePublicClient();
  const contract = getContract({
    address: GOERLI_CONTRACTS.L1Bridge,
    abi: L1BridgeAbi,
    publicClient: provider,
  });

  const {} = useTx({ hash: data?.hash, txSort: "Deposit" });

  return { write, contract, hash: data?.hash };
}
