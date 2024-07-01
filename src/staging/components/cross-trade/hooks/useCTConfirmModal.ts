import { ctConfirmModalStatus } from "@/recoil/modal/atom";
import { CTConfirmModalType } from "@/staging/components/cross-trade/types";
import { useRecoilState } from "recoil";
import { useCallback } from "react";
import { CT_History } from "@/staging/types/transaction";

export default function useCTConfirm() {
  const [ctConfirmModal, setCTConfirmModal] =
    useRecoilState(ctConfirmModalStatus);

  const onOpenCTConfirmModal = (params: {
    type: CTConfirmModalType["type"];
    txData: CT_History;
  }) => {
    const { type, txData } = params;
    setCTConfirmModal({ isOpen: true, type, txData });
  };

  const onCloseCTConfirmModal = useCallback(() => {
    setCTConfirmModal((prev) => ({ ...prev, isOpen: false, txData: null }));
  }, []);

  return {
    ctConfirmModal,
    onOpenCTConfirmModal,
    onCloseCTConfirmModal,
  };
}
