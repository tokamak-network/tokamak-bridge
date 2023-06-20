import { confirmModalStatus } from "@/recoil/modal/atom";
import { useCallback } from "react";
import { useRecoilState } from "recoil";

export default function useConfirm() {
  const [isOpen, setConfirmModal] = useRecoilState(confirmModalStatus);

  const onOpenConfirmModal = () => {
    setConfirmModal(true);
  };

  const onCloseConfirmModal = useCallback(() => {
    setConfirmModal(false);
  }, [setConfirmModal]);

  return {
    isOpen,
    onOpenConfirmModal,
    onCloseConfirmModal,
  };
}
