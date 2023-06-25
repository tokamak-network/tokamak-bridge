import { useEffect } from "react";
import L2BridgeAbi from "@/abis/L2StandardBridge.json";
import { transactionModalStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import { useContractWrite, usePublicClient } from "wagmi";
import { TOKAMAK_GOERLI_CONTRACTS } from "@/constant/contracts";
import { getContract } from "viem";

import { Contract } from "@ethersproject/contracts";
import { getL2Provider, l2Provider } from "@/config/l2Provider";
import { ethers } from "ethers";
import { useTx } from "@/hooks/tx/useTx";

export default function useCallWithdraw(functionName: string) {
  const [tModalStatus, setTModalStatus] = useRecoilState(
    transactionModalStatus
  );

  const { data, isLoading, isSuccess, isError, write } = useContractWrite({
    address: TOKAMAK_GOERLI_CONTRACTS.L2Bridge,
    abi: L2BridgeAbi,
    functionName,
  });

  const dd = useTx({ hash: data?.hash, txType: "Withdraw" });

  const provider = usePublicClient();
  const contract = getContract({
    address: TOKAMAK_GOERLI_CONTRACTS.L2Bridge,
    abi: L2BridgeAbi,
    publicClient: provider,
  });

  useEffect(() => {
    if (isLoading) {
      return setTModalStatus("confirming");
    }
    if (isSuccess) {
      return setTModalStatus("confirmed");
    }
    if (isError) {
      return setTModalStatus("error");
    }
    return setTModalStatus(null);
  }, [isLoading, isSuccess]);

  return { data, isLoading, isSuccess, write, contract };
}
