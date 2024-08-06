import useFxOptionModal from "@/staging/components/cross-trade/hooks/useCTOptionModal";
import useFxConfirmModal from "@/staging/components/cross-trade/hooks/useCTConfirmModal";
import useContract from "@/hooks/contracts/useContract";
import { useContractWrite } from "wagmi";
import L1CrossTradeAbi from "@/abis/L1CrossTrade.json";
import L2CrossTradeAbi from "@/abis/L2CrossTrade.json";
import { useTx } from "@/hooks/tx/useTx";
import { useEffect, useState } from "react";
import useTxConfirmModal from "@/hooks/modal/useTxConfirmModal";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { Hash } from "viem";

export const useRequestRegisteredToken = () => {
  const { L2CrossTrade_CONTRACT } = useContract();
  const { setModalOpen, setIsOpen } = useTxConfirmModal();
  const { data, write, isLoading, isSuccess, isError, error, status } =
    useContractWrite({
      address: L2CrossTrade_CONTRACT.L2CrossTradeProxy,
      abi: L2CrossTradeAbi.abi,
      functionName: "requestRegisteredToken",
    });
  const { inToken } = useInOutTokens();

  const {} = useTx({
    hash: data?.hash,
    txSort: "Request",
    tokenAddress: inToken?.tokenAddress as Hash,
  });

  return { data, write, isLoading, isSuccess, isError, error, status };
};

const useProvideCT = () => {
  const { L1CrossTrade_CONTRACT } = useContract();
  const { data, write, isLoading, isSuccess, isError, error, status } =
    useContractWrite({
      address: L1CrossTrade_CONTRACT.L1CrossTradeProxy,
      abi: L1CrossTradeAbi.abi,
      functionName: "provideCT",
    });
  const {} = useTx({ hash: data?.hash, txSort: "Request" });

  return { data, write, isLoading, isSuccess, isError, error, status };
};

const useEditFee = () => {
  const { L1CrossTrade_CONTRACT } = useContract();
  const { data, write, isLoading, isSuccess, isError, error, status } =
    useContractWrite({
      address: L1CrossTrade_CONTRACT.L1CrossTradeProxy,
      abi: L1CrossTradeAbi.abi,
      functionName: "editFee",
    });

  return { data, write, isLoading, isSuccess, isError, error, status };
};

const useCancelRequest = () => {
  const { L1CrossTrade_CONTRACT } = useContract();
  const { data, write, isLoading, isSuccess, isError, error, status } =
    useContractWrite({
      address: L1CrossTrade_CONTRACT.L1CrossTradeProxy,
      abi: L1CrossTradeAbi.abi,
      functionName: "cancel",
    });

  return { data, write, isLoading, isSuccess, isError, error, status };
};

export const useCrossTradeContract = () => {
  const {
    write: _requestRegisteredToken,
    isLoading: _isResisteredTokenLoading,
    data: _resisteredTokenData,
  } = useRequestRegisteredToken();
  const { write: _provideCT, isLoading: _isProvideLoading } = useProvideCT();
  const { write: _editFee, isLoading: _isEditLoading } = useEditFee();
  const { write: _cancelRequest, isLoading: _isCancelLoading } =
    useCancelRequest();

  const { setModalOpen, setIsOpen } = useTxConfirmModal();
  const { onCloseCTConfirmModal } = useFxConfirmModal();
  const { onCloseCTOptionModal } = useFxOptionModal();

  // useEffect(() => {
  //   if (
  //     _isResisteredTokenLoading ||
  //     _isProvideLoading ||
  //     _isEditLoading ||
  //     _isCancelLoading
  //   ) {
  //     onCloseCTConfirmModal();
  //     onCloseCTOptionModal();
  //     setIsOpen(true);
  //     setModalOpen("confirming");
  //   }
  // }, [
  //   _isResisteredTokenLoading,
  //   _isProvideLoading,
  //   _isEditLoading,
  //   _isCancelLoading,
  // ]);

  return {
    requestRegisteredToken: _requestRegisteredToken,
    provideCT: _provideCT,
    editFee: _editFee,
    cancelRequest: _cancelRequest,
  };
};
