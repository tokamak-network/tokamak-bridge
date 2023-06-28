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
import { useTx } from "@/hooks/tx/useTx";

export default function useCallDeposit(functionName: string) {
  const [tModalStatus, setTModalStatus] = useRecoilState(
    transactionModalStatus
  );

  const { data, isLoading, isSuccess, isError, write } = useContractWrite({
    address: GOERLI_CONTRACTS.L1Bridge,
    abi: L1BridgeAbi,
    functionName,
  });

  const {
    isLoading: _transactionLoading,
    data: _d,
    isSuccess: _t,
    status,
  } = useWaitForTransaction({
    hash: data?.hash,
  });

  const [, setTransactionData] = useRecoilState(transactionData);

  const provider = usePublicClient();
  const contract = getContract({
    address: GOERLI_CONTRACTS.L1Bridge,
    abi: L1BridgeAbi,
    publicClient: provider,
  });

  const {} = useTx({ hash: data?.hash, txSort: "Deposit" });

  // useEffect(() => {
  //   if (isLoading) {
  //     return setTModalStatus("confirming");
  //   }
  //   if (isSuccess) {
  //     return setTModalStatus("confirmed");
  //   }
  //   if (isError) {
  //     return setTModalStatus("error");
  //   }
  //   return setTModalStatus(null);
  // }, [isLoading, isSuccess]);

  // useEffect(() => {
  //   setTransactionData({ isLoading: _transactionLoading });
  // }, [_transactionLoading]);

  return { write, contract };
}
