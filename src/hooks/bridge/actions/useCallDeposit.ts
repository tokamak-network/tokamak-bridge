import { useEffect } from "react";
import L1BridgeAbi from "@/abis/L1StandardBridge.json";
import { transactionModalStatus } from "@/recoil/modal/atom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  useContractWrite,
  usePrepareContractWrite,
  usePublicClient,
  useWaitForTransaction,
} from "wagmi";
import {
  networkStatus,
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import { GOERLI_CONTRACTS } from "@/constant/contracts";
import { getContract } from "viem";
import { transactionData } from "@/recoil/global/transaction";
import { TransactionType } from "@/types/transactions/transactionTypes";

export default function useCallDeposit(functionName: string) {
  const [tModalStatus, setTModalStatus] = useRecoilState(
    transactionModalStatus
  );
  const network = useRecoilValue(networkStatus);
  const inTokenInfo = useRecoilValue(selectedInTokenStatus);
  const outTokenInfo = useRecoilValue(selectedOutTokenStatus);

  const { data, isLoading, isSuccess, isError, write } = useContractWrite({
    address: GOERLI_CONTRACTS.L1Bridge,
    abi: L1BridgeAbi,
    functionName,
  });

  const {
    isLoading: _transactionLoading,
    isSuccess: _transactionSuccess,
    data: _transactionData,
  } = useWaitForTransaction({
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
    setTransactionData({
      isLoading: _transactionLoading,
      isSuccess: _transactionSuccess ? 1 : undefined,
      txReceipt: _transactionData,
      info: {
        type: TransactionType.DEPOSIT,
        token0: inTokenInfo,
        inNetwork: network.inNetwork,
        outNetwork: network.outNetwork,
        currencyAmountRaw: inTokenInfo?.parsedAmount as string

      },
    });
  }, [_transactionLoading]);

  return { data, isLoading, isSuccess, write, contract };
}
