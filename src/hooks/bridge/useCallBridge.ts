import { useEffect } from "react";
import L1BridgeAbi from "@/abis/L1StandardBridge.json";
import { transactionModalStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import { useContractWrite } from "wagmi";

export default function useCallBridge(params: { functionName: string }) {
  const { functionName } = params;

  const [tModalStatus, setTModalStatus] = useRecoilState(
    transactionModalStatus
  );

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: "0x7377F3D0F64d7a54Cf367193eb74a052ff8578FD",
    abi: L1BridgeAbi,
    functionName,
  });

  useEffect(() => {
    console.log("gogo");
    if (isLoading) {
      console.log("gogo1");

      return setTModalStatus("confirming");
    }
    if (isSuccess) {
      console.log("gogo2");

      return setTModalStatus("confirmed");
    }
    console.log("gogo3");

    return setTModalStatus(null);
  }, [isLoading, isSuccess]);

  console.log(tModalStatus);

  return { data, isLoading, isSuccess, write };
}
