import { confirmModalStatus } from "@/recoil/modal/atom";
import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import useTxModal from "./useTxModal";
import { confirmWithdrawStatus } from "@/recoil/bridgeSwap/atom";

export default function useConfirm() {
  const [isOpen, setConfirmModal] = useRecoilState(confirmModalStatus);
  const [, setIsConfirm] = useRecoilState(confirmWithdrawStatus);
  const { txModalStatus } = useTxModal();

  const onOpenConfirmModal = () => {
    setConfirmModal(true);
  };

  const onCloseConfirmModal = useCallback(() => {
    setConfirmModal(false);
    setIsConfirm(false);
  }, [setConfirmModal]);

  useEffect(() => {
    if (txModalStatus !== null) {
      setConfirmModal(false);
    }
  }, [txModalStatus]);

  return {
    isOpen,
    onOpenConfirmModal,
    onCloseConfirmModal,
  };
}
