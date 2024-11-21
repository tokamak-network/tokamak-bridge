import { useContractRead } from "wagmi";
import L1StandardBridge_ABI from "@/constant/abis/L1StandardBridge.json";
import useContract from "@/hooks/contracts/useContract";

export const useGb = (input: `0x${string}`) => {
  const { L1BRIDGE_CONTRACT } = useContract();

  const { data, isError, isLoading } = useContractRead({
    address: L1BRIDGE_CONTRACT,
    abi: L1StandardBridge_ABI,
    functionName: "gb",
    args: [input],
  });

  return {
    gb: data,
    isError,
    isLoading,
  };
};
[];
