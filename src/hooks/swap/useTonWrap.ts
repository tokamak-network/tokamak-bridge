import { useCallback, useEffect } from "react";
import SwapperV2ABI from "@/abis/SwapperV2.json";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { useInOutTokens } from "../token/useInOutTokens";
import useContract from "../contracts/useContract";
import { useRecoilState, useRecoilValue } from "recoil";
import { transactionModalStatus } from "@/recoil/modal/atom";
import { transactionData } from "@/recoil/global/transaction";
import { TransactionType } from "@/types/transactions/transactionTypes";
import { transactionType } from "viem";
import { networkStatus } from "@/recoil/bridgeSwap/atom";

export default function useWrap() {
  const { SWAPPER_V2_CONTRACT } = useContract();
  const [tModalStatus, setTModalStatus] = useRecoilState(
    transactionModalStatus
  );
  const [t, setTransactionData] = useRecoilState(transactionData);
  const network = useRecoilValue(networkStatus);

  const { inToken,outToken } = useInOutTokens();
  const {isLoading: _tonWtonLoading,isSuccess:_tonWtonSuccess,isError: _tonWrapError, data:_tonWtonData, write: tonWton } = useContractWrite({
    address: SWAPPER_V2_CONTRACT as `0x${string}`,
    abi: SwapperV2ABI.abi,
    functionName: "tonToWton",
  });
  const {
    isLoading: tonWtonLoading,
    isSuccess: tonWtonSuccess,
    isError: tonWrapError,
    data: tonWtonData
  } = useWaitForTransaction({
    hash: _tonWtonData?.hash,
  });

  const {isLoading: _wtonTonLoading,isSuccess:_wtonTonSuccess,isError: _WtonUnwrapError, data:_wtonWTonData, write: wtonTon } = useContractWrite({
    address: SWAPPER_V2_CONTRACT as `0x${string}`,
    abi: SwapperV2ABI.abi,
    functionName: "wtonToTon",
  });

  const {
    isLoading: wtonTonLoading,
    isSuccess: wtonTonSuccess,
    isError: WtonUnwrapError,
    data: wtonWTonData
  } = useWaitForTransaction({
    hash: _wtonWTonData?.hash,
  });

  const wrapTON = useCallback(() => {
    try {
      if (inToken && inToken.amountBN) {
        tonWton({
          args: [inToken.amountBN],
        });
      }
    } catch (e) {
      console.log("**wrapTON err**");
      console.log(e);
    }
  }, [inToken]);

  const unwrapWTON = useCallback(() => {
    try {
      if (inToken && inToken.amountBN) {
        wtonTon({
          args: [inToken.amountBN],
        });
      }
    } catch (e) {
      console.log("**unwrapWTON err**");
      console.log(e);
    }
  }, [inToken]);

  useEffect(() => {    
    if (_tonWtonLoading || _wtonTonLoading) {
      return setTModalStatus("confirming");
    }
    if (_tonWtonSuccess || _wtonTonSuccess) {
      return setTModalStatus("confirmed");
    }
    if (_tonWrapError || _WtonUnwrapError) {
      return setTModalStatus("error");
    }
  }, [
    _tonWtonLoading,
    _wtonTonLoading,
    _tonWtonSuccess,
    _wtonTonSuccess,
    _tonWrapError,
   _WtonUnwrapError,
  ]);

  useEffect(() => {
    setTransactionData({ isLoading: tonWtonLoading, isSuccess: tonWtonSuccess? 1: undefined, txReceipt:tonWtonData,  info: {
      type: TransactionType.WRAP,
      unwrapped: false,
      currencyAmountRaw:  inToken?.parsedAmount as string,
      inputCurrency: inToken?.token,
      outputCurrency: outToken?.token,
      inNetwork: network.inNetwork,
      outNetwork: network.outNetwork,
    } });
  }, [tonWtonLoading,tonWtonSuccess,tonWtonData]);
  useEffect(() => {
    setTransactionData({ isLoading: wtonTonLoading, isSuccess: wtonTonSuccess? 1: undefined, txReceipt: wtonWTonData, info: {
      type: TransactionType.UNWRAP,
      unwrapped: true,
      currencyAmountRaw:  inToken?.parsedAmount as string,
      inputCurrency: inToken?.token,
      outputCurrency: outToken?.token,
      inNetwork: network.inNetwork,
      outNetwork: network.outNetwork,
    }  });
  }, [wtonTonLoading,wtonTonSuccess,wtonWTonData]);


  return { wrapTON, unwrapWTON };
}
