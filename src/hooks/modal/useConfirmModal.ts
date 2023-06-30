import { confirmModalStatus } from "@/recoil/modal/atom";
import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import useTxModal from "./useTxModal";
import { confirmWithdrawStatus } from "@/recoil/bridgeSwap/atom";
import useTxConfirmModal from "./useTxConfirmModal";

export default function useConfirm() {
  const [isOpen, setConfirmModal] = useRecoilState(confirmModalStatus);
  const [, setIsConfirm] = useRecoilState(confirmWithdrawStatus);
  const { isOpen: isTxOpen } = useTxConfirmModal();

  const onOpenConfirmModal = () => {
    setConfirmModal(true);
  };

  const onCloseConfirmModal = useCallback(() => {
    setConfirmModal(false);
    setIsConfirm(false);
  }, []);

  useEffect(() => {
    if (isTxOpen) {
      setConfirmModal(false);
    }
  }, [isTxOpen]);

  return {
    isOpen,
    onOpenConfirmModal,
    onCloseConfirmModal,
  };
}
