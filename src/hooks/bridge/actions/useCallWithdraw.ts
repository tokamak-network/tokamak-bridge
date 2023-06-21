import { useEffect } from "react";
import L2BridgeAbi from "@/abis/L2StandardBridge.json";
import { transactionModalStatus } from "@/recoil/modal/atom";
import { useRecoilState,useRecoilValue } from "recoil";
import {
  useContractWrite,
  usePublicClient,
  useWaitForTransaction,
} from "wagmi";
import { TOKAMAK_GOERLI_CONTRACTS } from "@/constant/contracts";
import { getContract } from "viem";

import { Contract } from "@ethersproject/contracts";
import { getL2Provider, l2Provider } from "@/config/l2Provider";
import { ethers } from "ethers";
import { transactionData } from "@/recoil/global/transaction";
import { TransactionType } from "@/types/transactions/transactionTypes";
import {
  networkStatus,
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";

export default function useCallWithdraw(functionName: string) {
  const [tModalStatus, setTModalStatus] = useRecoilState(
    transactionModalStatus
  );
  const [t, setTransactionData] = useRecoilState(transactionData);
  const network = useRecoilValue(networkStatus);
  const inTokenInfo = useRecoilValue(selectedInTokenStatus);
  const outTokenInfo = useRecoilValue(selectedOutTokenStatus);

  const { data, isLoading, isSuccess, isError, write } = useContractWrite({
    address: TOKAMAK_GOERLI_CONTRACTS.L2Bridge,
    abi: L2BridgeAbi,
    functionName,
  });

  const {
    isLoading: _transactionLoading,
    isSuccess: _transactionSuccess,
    data: _transactionData,
  } = useWaitForTransaction({
    hash: data?.hash,
  });
  useEffect(() => {
    setTransactionData({
      isLoading: _transactionLoading,
      isSuccess: _transactionSuccess ? 1 : undefined,
      txReceipt: _transactionData,
      info: {
        type: TransactionType.WITHDRAW,
        token0Address: inTokenInfo?.tokenAddress as `0x${string}`,
        inNetwork: network.inNetwork,
        outNetwork: network.outNetwork,
        currencyAmountRaw: inTokenInfo?.parsedAmount as string
      },
    });
  }, [_transactionLoading]);

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
