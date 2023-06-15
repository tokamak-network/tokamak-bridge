import { useEffect } from "react";
import L1BridgeAbi from "@/abis/L1StandardBridge.json";
import { transactionModalStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import {
  useContractWrite,
  usePrepareContractWrite,
  usePublicClient,
  useWaitForTransaction,
} from "wagmi";
import { GOERLI_CONTRACTS } from "@/constant/contracts";
import { getContract } from "viem";
import { transactionData } from "@/recoil/global/transaction";

export default function useCallDeposit(functionName: string) {
  const [tModalStatus, setTModalStatus] = useRecoilState(
    transactionModalStatus
  );

  const { data, isLoading, isSuccess, isError, write } = useContractWrite({
    address: GOERLI_CONTRACTS.L1Bridge,
    abi: L1BridgeAbi,
    functionName,
  });

  const { isLoading: _transactionLoading } = useWaitForTransaction({
    hash: data?.hash,
  });
  const [t, setTransactionData] = useRecoilState(transactionData);

  const provider = usePublicClient();
  const contract = getContract({
    address: GOERLI_CONTRACTS.L1Bridge,
    abi: L1BridgeAbi,
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

  useEffect(() => {
    setTransactionData({ isLoading: _transactionLoading });
  }, [_transactionLoading]);

  return { data, isLoading, isSuccess, write, contract };
}
