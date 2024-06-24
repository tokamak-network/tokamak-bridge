import { ctConfirmModalStatus } from "@/recoil/modal/atom";
import { CTConfirmModalType } from "@/staging/components/cross-trade/types";
import { useRecoilState } from "recoil";
import { useCallback } from "react";

export default function useCTConfirm() {
  const [ctConfirmModal, setCTConfirmModal] =
    useRecoilState(ctConfirmModalStatus);

  const onOpenCTConfirmModal = (type: CTConfirmModalType["type"]) => {
    setCTConfirmModal({ isOpen: true, type: type });
  };

  const onCloseCTConfirmModal = useCallback(() => {
    setCTConfirmModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    ctConfirmModal,
    onOpenCTConfirmModal,
    onCloseCTConfirmModal,
  };
}
