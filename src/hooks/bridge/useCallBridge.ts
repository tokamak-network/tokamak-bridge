import L1BridgeAbi from "@/abis/L1StandardBridge.json";
import { useContractWrite } from "wagmi";

export default function useCallBridge(params: { functionName: string }) {
  const { functionName } = params;
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: "0x7377F3D0F64d7a54Cf367193eb74a052ff8578FD",
    abi: L1BridgeAbi,
    functionName,
  });

  return { data, isLoading, isSuccess, write };
}
