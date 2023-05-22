import { useEffect } from "react";
import L1BridgeAbi from "@/abis/L1StandardBridge.json";
import { transactionModalStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import { useContractWrite } from "wagmi";
import { GOERLI_CONTRACTS } from "@/constant/contracts";

export default function useCallDeposit(functionName: string) {
  const [tModalStatus, setTModalStatus] = useRecoilState(
    transactionModalStatus
  );

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: GOERLI_CONTRACTS.L1Bridge,
    abi: L1BridgeAbi,
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
