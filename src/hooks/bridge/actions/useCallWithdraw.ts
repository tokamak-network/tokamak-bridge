import L2BridgeAbi from "@/abis/L2StandardBridge.json";
import { useContractWrite, usePublicClient } from "wagmi";
import { TOKAMAK_GOERLI_CONTRACTS } from "@/constant/contracts";
import { getContract } from "viem";

import { useTx } from "@/hooks/tx/useTx";

export default function useCallWithdraw(functionName: string) {
  const { data, write, isError } = useContractWrite({
    address: TOKAMAK_GOERLI_CONTRACTS.L2Bridge,
    abi: L2BridgeAbi,
    functionName,
  });

  const {} = useTx({ hash: data?.hash, txSort: "Withdraw" });

  const provider = usePublicClient();
  const contract = getContract({
    address: TOKAMAK_GOERLI_CONTRACTS.L2Bridge,
    abi: L2BridgeAbi,
    publicClient: provider,
  });

  return { write, contract, isError };
}
