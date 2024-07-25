import useFxOptionModal from "@/staging/components/cross-trade/hooks/useCTOptionModal";
import useFxConfirmModal from "@/staging/components/cross-trade/hooks/useCTConfirmModal";
import useContract from "@/hooks/contracts/useContract";
import { useContractWrite } from "wagmi";
import L1CrossTradeAbi from "@/abis/L1CrossTrade.json";
import L2CrossTradeAbi from "@/abis/L2CrossTrade.json";
import { useTx } from "@/hooks/tx/useTx";
import { useEffect } from "react";
import useTxConfirmModal from "@/hooks/modal/useTxConfirmModal";

const useRequestRegisteredToken = () => {
  const { L2CrossTrade_CONTRACT } = useContract();
  const { data, write, isLoading, isSuccess, isError, error, status } =
    useContractWrite({
      address: L2CrossTrade_CONTRACT.L2CrossTradeProxy,
      abi: L2CrossTradeAbi.abi,
      functionName: "requestRegisteredToken",
    });

  const {} = useTx({ hash: data?.hash, txSort: "Request" });
  const { setModalOpen, setIsOpen } = useTxConfirmModal();
  const { onCloseCTConfirmModal } = useFxConfirmModal();
  const { onCloseCTOptionModal } = useFxOptionModal();

  useEffect(() => {
    if (isLoading) {
      onCloseCTConfirmModal();
      onCloseCTOptionModal();
      setIsOpen(true);
      setModalOpen("confirming");
    }
  }, [isLoading]);

  // useEffect(() => {
  //   if (isSuccess) {
  //     return setModalOpen("confirmed");
  //   }
  //   if (isError || error) {
  //     return setModalOpen("error");
  //   }
  // }, [isSuccess, isError, error]);

  return { write };
};

const useProvideCT = () => {
  const { L1CrossTrade_CONTRACT } = useContract();
  const { data, write } = useContractWrite({
    address: L1CrossTrade_CONTRACT.L1CrossTradeProxy,
    abi: L1CrossTradeAbi.abi,
    functionName: "provideCT",
  });
  // const {} = useTx({ hash: data?.hash, txSort: "Withdraw" });

  return { write };
};

export const useCrossTradeContract = () => {
  const { write: _requestRegisteredToken } = useRequestRegisteredToken();
  const { write: _provideCT } = useProvideCT();

  return {
    requestRegisteredToken: _requestRegisteredToken,
    provideCT: _provideCT,
  };
};
