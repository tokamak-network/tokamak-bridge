import { swapConfirmModalStatus } from "@/recoil/modal/atom";
import { TransactionHistory } from "@/components/historyn/types";
import { useRecoilState } from "recoil";
import { useCallback } from "react";

export default function useSwapConfirm() {
  const [swapConfirmModal, setSwapConfirmModal] = useRecoilState(
    swapConfirmModalStatus
  );

  const onOpenSwapConfirmModal = (transaction: TransactionHistory) => {
    setSwapConfirmModal({ isOpen: true, transaction: transaction });
  };

  const onCloseSwapConfirmModal = useCallback(() => {
    setSwapConfirmModal({ isOpen: false, transaction: null });
  }, []);

  return {
    swapConfirmModal,
    onOpenSwapConfirmModal,
    onCloseSwapConfirmModal,
  };
}
