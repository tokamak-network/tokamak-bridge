import useFxOptionModal from "@/staging/components/cross-trade/hooks/useCTOptionModal";
import useFxConfirmModal from "@/staging/components/cross-trade/hooks/useCTConfirmModal";
import useContract from "@/hooks/contracts/useContract";
import { useContractWrite } from "wagmi";
import L1CrossTradeAbi from "@/abis/L1CrossTrade.json";
import L2CrossTradeAbi from "@/abis/L2CrossTrade.json";
import { useTx } from "@/hooks/tx/useTx";
import useTxConfirmModal from "@/hooks/modal/useTxConfirmModal";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { Hash } from "viem";
import { useEffect } from "react";
import useCTUpdateFee from "../components/cross-trade/hooks/useCTUpdateFeeModal";

const useRequestRegisteredToken = () => {
  const { L2CrossTrade_CONTRACT } = useContract();
  const { setModalOpen, setIsOpen } = useTxConfirmModal();
  const { onCloseCTConfirmModal } = useFxConfirmModal();
  const { onCloseCTOptionModal } = useFxOptionModal();

  const { data, write, isLoading, isSuccess, isError, error, status } =
    useContractWrite({
      address: L2CrossTrade_CONTRACT.L2CrossTradeProxy,
      abi: L2CrossTradeAbi.abi,
      functionName: "requestRegisteredToken",
    });
  const { inToken } = useInOutTokens();

  console.log("isLoading", isLoading);

  const {} = useTx({
    hash: data?.hash,
    txSort: "Request",
    tokenAddress: inToken?.tokenAddress as Hash,
  });

  useEffect(() => {
    if (isLoading) {
      setIsOpen(true);
      setModalOpen("confirming");
      onCloseCTConfirmModal();
      onCloseCTOptionModal();
    }
  }, [isLoading]);

  return { data, write, isLoading, isSuccess, isError, error, status };
};
const useProvideCT = () => {
  const { L1CrossTrade_CONTRACT } = useContract();
  const { setModalOpen, setIsOpen } = useTxConfirmModal();
  const { onCloseCTConfirmModal } = useFxConfirmModal();
  const { onCloseCTOptionModal } = useFxOptionModal();

  const { data, write, isLoading, isSuccess, isError, error, status } =
    useContractWrite({
      address: L1CrossTrade_CONTRACT.L1CrossTradeProxy,
      abi: L1CrossTradeAbi.abi,
      functionName: "provideCT",
    });
  const {} = useTx({ hash: data?.hash, txSort: "Provide" });

  useEffect(() => {
    if (isLoading) {
      setIsOpen(true);
      setModalOpen("confirming");
      onCloseCTConfirmModal();
      onCloseCTOptionModal();
    }
  }, [isLoading]);

  return { data, write, isLoading, isSuccess, isError, error, status };
};

const useEditFee = () => {
  const { L1CrossTrade_CONTRACT } = useContract();
  const { setModalOpen, setIsOpen } = useTxConfirmModal();
  const { onCloseCTConfirmModal } = useFxConfirmModal();
  const { onCloseCTOptionModal } = useFxOptionModal();

  const { data, write, isLoading, isSuccess, isError, error, status } =
    useContractWrite({
      address: L1CrossTrade_CONTRACT.L1CrossTradeProxy,
      abi: L1CrossTradeAbi.abi,
      functionName: "editFee",
    });
  const {} = useTx({
    hash: data?.hash,
    txSort: "UpdateFee",
    actionSort: "Cross Trade",
    // tokenAddress,
  });

  useEffect(() => {
    if (isLoading) {
      setIsOpen(true);
      setModalOpen("confirming");
      onCloseCTConfirmModal();
      onCloseCTOptionModal();
    }
  }, [isLoading]);

  return { data, write, isLoading, isSuccess, isError, error, status };
};

const useCancelRequest = () => {
  const { L1CrossTrade_CONTRACT } = useContract();
  const { setModalOpen, setIsOpen } = useTxConfirmModal();
  const { onCloseCTUpdateFeeModal } = useCTUpdateFee();
  const { data, write, isLoading, isSuccess, isError, error, status } =
    useContractWrite({
      address: L1CrossTrade_CONTRACT.L1CrossTradeProxy,
      abi: L1CrossTradeAbi.abi,
      functionName: "cancel",
    });
  const {} = useTx({
    hash: data?.hash,
    txSort: "CancelRequest",
    actionSort: "Cross Trade",
    // tokenAddress,
  });

  useEffect(() => {
    if (isLoading) {
      setIsOpen(true);
      setModalOpen("confirming");
      onCloseCTUpdateFeeModal();
    }
  }, [isLoading]);

  return { data, write, isLoading, isSuccess, isError, error, status };
};

export const useCrossTradeContract = () => {
  const {
    write: _requestRegisteredToken,
    isLoading: _isResisteredTokenLoading,
    data: _resisteredTokenData,
    isError: _isrequestRegisteredTokenError,
  } = useRequestRegisteredToken();
  const {
    write: _provideCT,
    isLoading: _isProvideLoading,
    isError: _isProvideError,
  } = useProvideCT();
  const {
    write: _editFee,
    isLoading: _isEditLoading,
    isError: _isEditError,
  } = useEditFee();
  const {
    write: _cancelRequest,
    isLoading: _isCancelLoading,
    isError: _isCancelError,
  } = useCancelRequest();

  const { setModalOpen, setIsOpen } = useTxConfirmModal();

  useEffect(() => {
    if (
      _isrequestRegisteredTokenError ||
      _isProvideError ||
      _isEditError ||
      _isCancelError
    ) {
      setIsOpen(true);
      setModalOpen("error");
    }
  }, [
    _isrequestRegisteredTokenError,
    _isProvideError,
    _isEditError,
    _isCancelError,
  ]);

  return {
    requestRegisteredToken: _requestRegisteredToken,
    provideCT: _provideCT,
    editFee: _editFee,
    cancelRequest: _cancelRequest,
  };
};
