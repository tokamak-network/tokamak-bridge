import { useEffect } from "react";
import L2BridgeAbi from "@/abis/L2StandardBridge.json";
import { transactionModalStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import { useContractWrite } from "wagmi";
import { TOKAMAK_GOERLI_CONTRACTS } from "@/constant/contracts";

export default function useCallWithdraw(functionName: string) {
  const [tModalStatus, setTModalStatus] = useRecoilState(
    transactionModalStatus
  );

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: TOKAMAK_GOERLI_CONTRACTS.L2Bridge,
    abi: L2BridgeAbi,
    functionName,
  });

  useEffect(() => {
    if (isLoading) {
      return setTModalStatus("confirming");
    }
    if (isSuccess) {
      return setTModalStatus("confirmed");
    }
    return setTModalStatus(null);
  }, [isLoading, isSuccess]);

  return { data, isLoading, isSuccess, write };
}
