import L1TitanBridgeAbi from "@/abis/L1StandardBridge.json";
import L1ThanosBridgeAbi from "@/abis/L1ThanosStandardBridge.json";
import { useContractWrite, usePublicClient } from "wagmi";
import { getContract } from "viem";
import { useTx } from "@/hooks/tx/useTx";
import useContract from "@/hooks/contracts/useContract";
import { useInOutNetwork } from "@/hooks/network";
import { THANOS_SEPOLIA_CHAIN_ID } from "@/constant/network/thanos";

export default function useCallDeposit(functionName: string) {
  const { outNetwork } = useInOutNetwork();
  const abi =
    outNetwork?.chainId === THANOS_SEPOLIA_CHAIN_ID
      ? L1ThanosBridgeAbi
      : L1TitanBridgeAbi;
  const { L1BRIDGE_CONTRACT } = useContract();
  const { data, write, isError } = useContractWrite({
    address: L1BRIDGE_CONTRACT,
    abi: abi,
    functionName,
  });
  const provider = usePublicClient();
  const contract = getContract({
    address: L1BRIDGE_CONTRACT,
    abi: abi,
    publicClient: provider,
  });
  const {} = useTx({ hash: data?.hash, txSort: "Deposit" });

  return { write, contract, hash: data?.hash, isError };
}
