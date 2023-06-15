import { useEffect } from "react";
import L2BridgeAbi from "@/abis/L2StandardBridge.json";
import { transactionModalStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import { useContractWrite, usePublicClient } from "wagmi";
import { TOKAMAK_GOERLI_CONTRACTS } from "@/constant/contracts";
import { getContract } from "viem";

import { Contract } from "@ethersproject/contracts";
import { l2Provider } from "@/config/l2Provider";

export default function useCallWithdraw(functionName: string) {
  const [tModalStatus, setTModalStatus] = useRecoilState(
    transactionModalStatus
  );

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: TOKAMAK_GOERLI_CONTRACTS.L2Bridge,
    abi: L2BridgeAbi,
    functionName,
  });

  const provider = usePublicClient();
  const contract = getContract({
    address: TOKAMAK_GOERLI_CONTRACTS.L2Bridge,
    abi: L2BridgeAbi,
    publicClient: provider,
  });

  const test = new Contract(
    TOKAMAK_GOERLI_CONTRACTS.L2Bridge,
    L2BridgeAbi,
    l2Provider
  );

  useEffect(() => {
    if (isLoading) {
      return setTModalStatus("confirming");
    }
    if (isSuccess) {
      return setTModalStatus("confirmed");
    }
    return setTModalStatus(null);
  }, [isLoading, isSuccess]);

  return { data, isLoading, isSuccess, write, contract: test };
}
