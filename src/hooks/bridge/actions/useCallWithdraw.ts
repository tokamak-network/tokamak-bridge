import L2BridgeAbi from "@/abis/L2StandardBridge.json";
import { useContractWrite, usePublicClient } from "wagmi";
import { TOKAMAK_GOERLI_CONTRACTS } from "@/constant/contracts";
import { Hash, getContract } from "viem";
import useContract from "@/hooks/contracts/useContract";

import { useTx } from "@/hooks/tx/useTx";

export default function useCallWithdraw(functionName: string) {
  const { L2BRIDGE_CONTRACT } = useContract();
  const { data, write, isError } = useContractWrite({
    address: L2BRIDGE_CONTRACT as Hash,
    abi: L2BridgeAbi,
    functionName,
  });

  const {} = useTx({ hash: data?.hash, txSort: "Withdraw" });

  const provider = usePublicClient();
  const contract = getContract({
    address: L2BRIDGE_CONTRACT as Hash,
    abi: L2BridgeAbi,
    publicClient: provider,
  });

  return { write, contract, isError };
}
