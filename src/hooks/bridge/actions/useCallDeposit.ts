import L1BridgeAbi from "@/abis/L1StandardBridge.json";
import { useContractWrite, usePublicClient } from "wagmi";
import { getContract } from "viem";
import { useTx } from "@/hooks/tx/useTx";
import useContract from "@/hooks/contracts/useContract";

export default function useCallDeposit(functionName: string) {
  const { L1BRIDGE_CONTRACT } = useContract();

  const { data, write, isError } = useContractWrite({
    address: L1BRIDGE_CONTRACT,
    abi: L1BridgeAbi,
    functionName,
  });

  const provider = usePublicClient();
  const contract = getContract({
    address: L1BRIDGE_CONTRACT,
    abi: L1BridgeAbi,
    publicClient: provider,
  });

  const {} = useTx({ hash: data?.hash, txSort: "Deposit" });

  return { write, contract, hash: data?.hash, isError };
}
