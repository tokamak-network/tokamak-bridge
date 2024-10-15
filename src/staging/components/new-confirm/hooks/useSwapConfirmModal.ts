import { swapConfirmModalStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import { useCallback } from "react";

export default function useSwapConfirm() {
  const [swapConfirmModal, setSwapConfirmModal] = useRecoilState(
    swapConfirmModalStatus,
  );

  const onOpenSwapConfirmModal = () => {
    setSwapConfirmModal(true);
  };

  const onCloseSwapConfirmModal = useCallback(() => {
    setSwapConfirmModal(false);
  }, []);

  return {
    swapConfirmModal,
    onOpenSwapConfirmModal,
    onCloseSwapConfirmModal,
  };
}
